import React, { ChangeEvent } from 'react';
import Alert from 'react-bootstrap/Alert';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useSearchDeckboxFile } from '../../hooks/useSearchDeckboxFile';

const CredentialsDeckboxFileForm: React.FC = () => {
  const { searchAndUpdate } = useSearchDeckboxFile();

  return (
    <>
      <FloatingLabel className="mb-3" label="File">
        <Form.Control
          aria-label="Bearer token"
          type="file"
          accept=".csv"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
            if (file === null) {
              throw new Error('No Deckbox file provided!');
            }

            void searchAndUpdate(file);
          }}
        />
      </FloatingLabel>
      <Alert variant="primary">
        <Alert.Heading>Usage</Alert.Heading>
        <p>
          Deckbox does not currently provide a public API, so you need to import your collection using CSV exported from
          Deckbox. While exporting data, following fields must be selected:
        </p>
        <ul>
          <li>Type</li>
          <li>Cost</li>
          <li>Rarity</li>
          <li>Image URL</li>
        </ul>
      </Alert>
    </>
  );
};

export default CredentialsDeckboxFileForm;
