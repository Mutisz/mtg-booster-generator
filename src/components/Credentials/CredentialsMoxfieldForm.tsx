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
          To check Moxfield configuration instructions see{' '}
          <a href="https://github.com/Mutisz/mtg-booster-generator" target="_blank">
            here
          </a>
          .
        </p>
      </Alert>
      <Button
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
