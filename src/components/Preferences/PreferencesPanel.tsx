import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardHeader from 'react-bootstrap/CardHeader';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useActionProgress } from '../../hooks/useActionProgress';
import { useBoosterList } from '../../hooks/useBoosterList';
import { useCardList } from '../../hooks/useCardList';
import { usePreferences } from '../../hooks/usePreferences';
import { useSetList } from '../../hooks/useSetList';
import { BoosterType } from '../../state';

const minBoosterCount = 1;
const maxBoosterCount = 12;

const PreferencesPanel: React.FC = () => {
  const { isActionInProgress } = useActionProgress();
  const { preferences, setPreferences } = usePreferences();
  const { cardList } = useCardList();
  const { generateBoosterList } = useBoosterList();
  const { setList } = useSetList();

  return (
    <Card style={{ minHeight: '36rem' }}>
      <CardHeader>Preferences</CardHeader>
      <CardBody>
        <Form>
          <FloatingLabel className="mb-3" label="Booster type">
            <Form.Select
              aria-label="Booster type"
              value={preferences.boosterType as string}
              onChange={(event) =>
                setPreferences({ ...preferences, boosterType: event.currentTarget.value as BoosterType })
              }
            >
              {Object.values(BoosterType).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="Booster count">
            <Form.Control
              aria-label="Booster count"
              type="number"
              min={minBoosterCount}
              max={maxBoosterCount}
              value={preferences.boosterCount}
              onChange={(event) => {
                const value = parseInt(event.currentTarget.value);
                if (isNaN(value) === false && value >= minBoosterCount && value <= maxBoosterCount) {
                  setPreferences({ ...preferences, boosterCount: value });
                }
              }}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="Expansion sets">
            <Form.Select
              multiple
              value={preferences.expansionSetCodeList}
              style={{ height: 200 }}
              onChange={(event) =>
                setPreferences({
                  ...preferences,
                  expansionSetCodeList: [...event.currentTarget.selectedOptions].map(
                    (selectedOption) => selectedOption.value,
                  ),
                })
              }
            >
              {setList.map((set) => (
                <option key={set.code} value={set.code}>
                  {set.name}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              label="Balance colors"
              disabled={preferences.boosterType === BoosterType.Jumpstart}
              checked={preferences.balanceColors}
              onChange={(event) => setPreferences({ ...preferences, balanceColors: event.currentTarget.checked })}
            />
          </Form.Group>
          <Button
            variant={'primary'}
            disabled={cardList.length === 0 || isActionInProgress()}
            onClick={() => void generateBoosterList()}
          >
            Generate boosters
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PreferencesPanel;
