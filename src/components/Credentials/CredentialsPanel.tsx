import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardHeader from 'react-bootstrap/CardHeader';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useCredentialsSource } from '../../hooks/useCredentialsSource';
import { Source } from '../../state';
import CredentialsDeckboxFileForm from './CredentialsDeckboxFileForm';
import CredentialsMoxfieldForm from './CredentialsMoxfieldForm';

const renderCredentialsForm = (source: Source | null) => {
  if (source === Source.MoxfieldApi) {
    return <CredentialsMoxfieldForm />;
  }
  if (source === Source.DeckboxFile) {
    return <CredentialsDeckboxFileForm />;
  }

  throw new Error('Unhandled collection source!');
};

const CredentialsPanel: React.FC = () => {
  const { source, setSource } = useCredentialsSource();

  return (
    <Card style={{ minHeight: '36rem' }}>
      <CardHeader>Credentials</CardHeader>
      <CardBody>
        <Form>
          <FloatingLabel className="mb-3" label="Source">
            <Form.Select
              aria-label="Source"
              value={source as string}
              onChange={(event) => setSource(event.currentTarget.value as Source)}
            >
              {Object.values(Source).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          {renderCredentialsForm(source)}
        </Form>
      </CardBody>
    </Card>
  );
};

export default CredentialsPanel;
