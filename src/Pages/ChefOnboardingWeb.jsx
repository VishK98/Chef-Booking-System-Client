import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import CloseButton from 'react-bootstrap/CloseButton';
import Alert from 'react-bootstrap/Alert';
import './ChefOnboardingWeb.css';

const ChefOnboardingWeb = () => {
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tags, setTags] = useState([]);

  const handlePersonalInfo = (event) => {
    event.preventDefault();
    setShowPersonalInfoForm(false);
  };

  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      const tag = e.target.value.trim().replace(/,/g, '');
      if (tag && !tags.includes(tag)) {
        const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        setTags([...tags, capitalizedTag]);
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <div className='onboarding-container'>
        <div className='onboarding-image-carousel'></div>
        <div className='onboarding-form-div'>
          {showPersonalInfoForm ? (
            <Form onSubmit={handlePersonalInfo} className='onboarding-form'>
              <Form.Group controlId='name'>
                <div className='form-text-label-group'>
                  <Form.Label>Full name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Adam Smith'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId='email'>
                <div className='form-text-label-group'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='adam@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId='phoneNumber'>
                <div className='form-text-label-group'>
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    type='tel'
                    placeholder='+61 ...'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <div className='submit-button'>
                <button type='submit'>Continue</button>
              </div>
            </Form>
          ) : (
            <div className='wrapper'>
              <div className='select-cuisine-title'>
                <h2>Select cuisines</h2>
                <p>
                  Choose multiple cuisines that you are confident to offer for
                  our customers.
                </p>
              </div>
              <div className='select-cuisine-title-content'>
                {/* <p className="info">
                                    Press enter or add a comma after each tag
                                </p> */}
                <Alert key={'info'} variant={'info'} className='custom-alert'>
                  Press enter or add a comma after each tag
                </Alert>
                <ul>
                  {tags.map((tag, index) => (
                    <li key={index}>
                      {tag}
                      &nbsp;
                      <CloseButton
                        className='close-btn-custom'
                        onClick={() => removeTag(tag)}
                      />
                    </li>
                  ))}
                  <input type='text' spellCheck='false' onKeyUp={addTag} />
                </ul>
              </div>
              <div className='select-cuisine-details'>
                <p>
                  <span>{tags.length}</span> cuisines are added
                </p>
                <button onClick={() => setTags([])}>Submit</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChefOnboardingWeb;
