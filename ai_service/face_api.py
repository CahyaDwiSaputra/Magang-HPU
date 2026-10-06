import os
import json
import base64
import numpy as np
import cv2
from flask import Flask, request, jsonify

app = Flask(__name__)

# File paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'face_model.yml')
LABEL_MAP_PATH = os.path.join(BASE_DIR, 'label_map.json')
CASCADE_PATH = os.path.join(BASE_DIR, 'haarcascade_frontalface_default.xml')

# Initialize Face Detector & Recognizer
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
recognizer = cv2.face.LBPHFaceRecognizer_create()

# Load mapping (int -> employee_id)
label_map = {}
if os.path.exists(LABEL_MAP_PATH):
    with open(LABEL_MAP_PATH, 'r') as f:
        # json keys are always strings, so we convert back to int
        label_map_str = json.load(f)
        label_map = {int(k): v for k, v in label_map_str.items()}

# Load trained model if exists
if os.path.exists(MODEL_PATH):
    try:
        recognizer.read(MODEL_PATH)
        print("Model loaded successfully.")
    except Exception as e:
        print("Error loading model:", e)

def get_base64_image(b64_string):
    """Convert base64 string to OpenCV image (grayscale)."""
    try:
        # Remove data URI prefix if present
        if ',' in b64_string:
            b64_string = b64_string.split(',')[1]
        
        img_data = base64.b64decode(b64_string)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return gray
    except Exception as e:
        print(f"Image decode error: {e}")
        return None

def detect_face(gray_img):
    """Detect the largest face in the image."""
    faces = face_cascade.detectMultiScale(gray_img, scaleFactor=1.1, minNeighbors=4, minSize=(50, 50))
    if len(faces) == 0:
        return None
    # Pick largest face
    faces = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)
    x, y, w, h = faces[0]
    return gray_img[y:y+h, x:x+w]

@app.route('/train', methods=['POST'])
def train():
    data = request.json
    if not data or 'image' not in data or 'employee_id' not in data:
        print("Train Error: Missing image or employee_id")
        return jsonify({'status': 'error', 'message': 'Missing image or employee_id'}), 400
    
    employee_id = str(data['employee_id'])
    gray = get_base64_image(data['image'])
    
    if gray is None:
        print("Train Error: Invalid image format")
        return jsonify({'status': 'error', 'message': 'Invalid image format'}), 400
        
    face_roi = detect_face(gray)
    if face_roi is None:
        print("Train Error: No face detected in image")
        return jsonify({'status': 'error', 'message': 'No face detected in image'}), 400

    # Get integer label for employee_id
    # Check if employee_id already exists in values
    int_label = None
    for k, v in label_map.items():
        if v == employee_id:
            int_label = k
            break
            
    if int_label is None:
        int_label = len(label_map) + 1
        label_map[int_label] = employee_id

    # Train / Update model
    # LBPH can be updated incrementally
    if os.path.exists(MODEL_PATH):
        recognizer.update([face_roi], np.array([int_label]))
    else:
        recognizer.train([face_roi], np.array([int_label]))
        
    # Save model and map
    recognizer.write(MODEL_PATH)
    with open(LABEL_MAP_PATH, 'w') as f:
        json.dump(label_map, f)
        
    return jsonify({
        'status': 'ok', 
        'message': f'Face trained for employee {employee_id}',
        'label': int_label
    })

@app.route('/recognize', methods=['POST'])
def recognize():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'Missing image'}), 400
        
    if not os.path.exists(MODEL_PATH) or not label_map:
        return jsonify({'status': 'error', 'message': 'Model not trained yet', 'match': None}), 200

    gray = get_base64_image(data['image'])
    if gray is None:
        return jsonify({'status': 'error', 'message': 'Invalid image format'}), 400
        
    face_roi = detect_face(gray)
    if face_roi is None:
        print("Recognize Error: No face detected")
        return jsonify({'status': 'error', 'message': 'No face detected', 'match': None}), 200
        
    try:
        label, confidence = recognizer.predict(face_roi)
        print(f"Recognized label {label} with confidence {confidence}")
        
        # LBPH distance (lower is better, 0 is exact match)
        mapped_confidence = max(0, 100 - (confidence * 0.7))
        
        employee_id = label_map.get(label)
        
        # Threshold: if distance > 85, reject
        if confidence > 85:
            return jsonify({
                'status': 'ok',
                'match': None,
                'distance': confidence,
                'message': 'Face unknown'
            })
            
        return jsonify({
            'status': 'ok',
            'match': employee_id,
            'confidence': mapped_confidence,
            'distance': confidence
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    print("Starting Face Recognition API on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=False)
