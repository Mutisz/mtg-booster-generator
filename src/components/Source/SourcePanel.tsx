import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardHeader from 'react-bootstrap/CardHeader';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useSourceType } from '../../hooks/useSourceType';
import { SourceType } from '../../state';
import SourceDeckboxFileForm from './SourceDeckboxFileForm';
import SourceMoxfieldApiForm from './SourceMoxfieldApiForm';

const sourceNameMap = {
  [SourceType.MoxfieldApi]: 'Moxfield API',
  [SourceType.MoxfieldFile]: 'Moxfield file',
  [SourceType.DeckboxFile]: 'Deckbox file',
};

const renderSourceForm = (sourceType: SourceType | null) => {
  if (sourceType === SourceType.MoxfieldApi) {
    return <SourceMoxfieldApiForm />;
  }
  if (sourceType === SourceType.DeckboxFile) {
    return <SourceDeckboxFileForm />;
  }

  throw new Error('Unhandled collection source!');
};

const SourcePanel: React.FC = () => {
  const { sourceType, setSourceType } = useSourceType();

  return (
    <Card style={{ minHeight: '36rem' }}>
      <CardHeader>Source</CardHeader>
      <CardBody>
        <Form>
          <FloatingLabel className="mb-3" label="Source">
            <Form.Select
              aria-label="Source"
              value={sourceType as string}
              onChange={(event) => setSourceType(event.currentTarget.value as SourceType)}
            >
              {Object.values(SourceType).map((value) => (
                <option key={value} value={value}>
                  {sourceNameMap[value]}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          {renderSourceForm(sourceType)}
        </Form>
      </CardBody>
    </Card>
  );
};

export default SourcePanel;
