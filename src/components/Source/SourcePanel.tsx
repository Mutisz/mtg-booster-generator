import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { useSearchProgress } from '../../hooks/useSearchProgress';
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

const renderProgress = (progress: number) => {
  if (progress === 0) {
    return (
      <Badge bg="warning" text="dark">
        UNFETCHED
      </Badge>
    );
  }
  if (progress === 100) {
    return <Badge bg="success">FETCHED</Badge>;
  }

  return <ProgressBar now={progress} label={`${progress}%`} visuallyHidden />;
};

const SourcePanel: React.FC = () => {
  const { sourceType, setSourceType } = useSourceType();
  const { searchProgress, isInProgress } = useSearchProgress();

  return (
    <Card style={{ minHeight: '36rem' }}>
      <Card.Header>Source</Card.Header>
      <Card.Body>
        <Form>
          <FloatingLabel className="mb-3" label="Source">
            <Form.Select
              aria-label="Source"
              disabled={isInProgress()}
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
      </Card.Body>
      <Card.Footer>{renderProgress(searchProgress)}</Card.Footer>
    </Card>
  );
};

export default SourcePanel;
