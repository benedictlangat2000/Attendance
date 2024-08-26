import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacialRecognition = ({ onFaceDetected }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models'; // Path to face-api.js models
        await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
        await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL);
        await faceapi.loadFaceExpressionModel(MODEL_URL);

        setLoading(false);
      } catch (err) {
        setError('Error loading face recognition models');
      }
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          setError('Error accessing webcam');
        });
    };

    loadModels().then(startVideo);
  }, []);

  const handleVideoPlay = async () => {
    const video = videoRef.current;

    setInterval(async () => {
      if (video && !loading) {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          onFaceDetected(detections);
        }
      }
    }, 100);
  };

  return (
    <div className="container mt-4">
      {loading && <div>Loading face recognition models...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div>
          <h5 className="text-center mb-4">Facial Recognition</h5>
          <video
            ref={videoRef}
            onPlay={handleVideoPlay}
            width="720"
            height="560"
            autoPlay
            muted
            className="border"
          />
        </div>
      )}
    </div>
  );
};

export default FacialRecognition;
