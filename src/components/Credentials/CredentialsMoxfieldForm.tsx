import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { useCredentialsMoxfield } from '../../hooks/useCredentialsMoxfield';
import { usePreferences } from '../../hooks/usePreferences';
import { useSearchMoxfield } from '../../hooks/useSearchMoxfield';
import { defaults } from '../../state';

const CredentialsMoxfieldForm: React.FC = () => {
  const { credentialsMoxfield, setCredentialsMoxfield } = useCredentialsMoxfield();
  const { preferences, setPreferences } = usePreferences();
  const { cardCollectionProgress, cardCollection, searchAndUpdate } = useSearchMoxfield();

  return (
    <>
      <FloatingLabel className="mb-3" label="Bearer token">
        <Form.Control
          aria-label="Bearer token"
          type="text"
          value={credentialsMoxfield.bearerToken}
          onChange={(event) => setCredentialsMoxfield({ bearerToken: event.currentTarget.value })}
        />
      </FloatingLabel>
      <Alert variant="primary">
        <Alert.Heading>Usage</Alert.Heading>
        <p>
          Moxfield does not currently provide a public API, so you need to extract the token from their website
          manually. Also CORS will need to be disabled so that browser does not block request from this app.
        </p>
        <p>
          To learn how to do this see readme{' '}
          <a href="https://github.com/Mutisz/mtg-booster-generator" target="_blank">
            here
          </a>
          .
        </p>
      </Alert>
      {cardCollectionProgress === 0 ? (
        <Button
          variant={cardCollection.length === 0 ? 'primary' : 'success'}
          disabled={credentialsMoxfield.bearerToken === ''}
          onClick={() => {
            setPreferences({ ...preferences, expansionSetNameList: defaults.preferences.expansionSetNameList });
            void searchAndUpdate();
          }}
        >
          Fetch collection
        </Button>
      ) : (
        <ProgressBar now={cardCollectionProgress} label={`${cardCollectionProgress}%`} visuallyHidden />
      )}
    </>
  );
};

export default CredentialsMoxfieldForm;
