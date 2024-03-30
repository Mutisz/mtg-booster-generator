import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useCredentialsMoxfield } from '../../hooks/useCredentialsMoxfield';
import { usePreferences } from '../../hooks/usePreferences';
import { useSearchMoxfield } from '../../hooks/useSearchMoxfield';
import { defaults } from '../../state';

const CredentialsMoxfieldForm: React.FC = () => {
  const { credentialsMoxfield, setCredentialsMoxfield } = useCredentialsMoxfield();
  const { preferences, setPreferences } = usePreferences();
  const { cardCollectionLoading, searchAndUpdate } = useSearchMoxfield();

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
          Moxfield does not currently provide an easily accessible public API, so to fetch collection from Moxfield you
          need to extract the token from their website manually. Also CORS will need to be disabled so that browser does
          not block request from this app to Moxfield.
        </p>
        <p>
          To learn how to do this see readme{' '}
          <a href="https://github.com/Mutisz/nms-taxonomy" target="_blank">
            here
          </a>
          .
        </p>
      </Alert>
      <Button
        style={{ position: 'absolute', bottom: 'var(--bs-card-spacer-y)' }}
        variant="primary"
        disabled={credentialsMoxfield.bearerToken === '' || cardCollectionLoading === true}
        onClick={() => {
          setPreferences({ ...preferences, expansionSetNameList: defaults.preferences.expansionSetNameList });
          void searchAndUpdate();
        }}
      >
        Fetch collection
      </Button>
    </>
  );
};

export default CredentialsMoxfieldForm;
