import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import getCroppedImg from './cropImage';
import './ProfilePhoto.css';

// Existing style object in ProfilePhoto.js, modify the `width` and add `height` if needed
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%', // Adjust width as needed, or use a specific value like '600px'
  maxWidth: '600px', // You can also set a maxWidth if you want
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '50%',
};

function ProfilePhoto({ updateChefImage, chefImage }) {
  console.log(chefImage);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setImageSrc(imageDataUrl);
      setShowModal(true); // Open the modal
      setImage(e);
    }
  };

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImg.url);
      console.log(croppedImg);
      setShowModal(false); // Close the modal
      updateChefImage(croppedImg);
    } catch (e) {
      console.error(e);
    }
  };

  const incrementZoom = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  const decrementZoom = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1));
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className='profile-container-chef'>
      <div className='profile-photo' onClick={() => setImageSrc(null)}>
        <img src={chefImage} alt='Profile' />
      </div>

      <input
        id='imageUpload'
        type='file'
        accept='image/*'
        onChange={onFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor='imageUpload' className='upload-button'>
        Upload
      </label>

      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div className='cropper-container'>
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape='round'
                showGrid={false}
              />
            )}
            <div className='zoom-controls'>
              <Button
                variant='contained'
                className='zoom-button'
                onClick={decrementZoom}
                disabled={zoom === 1}
                style={{ color: 'teal', backgroundColor: 'white' }}
              >
                -
              </Button>
              <Button
                variant='contained'
                className='zoom-button'
                onClick={incrementZoom}
                disabled={zoom === 3}
                style={{ color: 'teal', backgroundColor: 'white' }}
              >
                +
              </Button>
            </div>
          </div>
          <button
            variant='contained'
            className='crop-button'
            onClick={handleCrop}
          >
            Crop
          </button>
        </Box>
      </Modal>
    </div>
  );
}

export default ProfilePhoto;
