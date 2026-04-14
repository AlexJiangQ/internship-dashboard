import type { PreferenceKey, PreferencePayload } from "../../types/dashboard";

const GROUP_LABELS: Record<PreferenceKey, string> = {
  skills: "Skills",
  work_focus: "Work Focus",
  career_goal: "Career Goal"
};

interface PreferenceSelectionPanelProps {
  options: Record<PreferenceKey, string[]>;
  value: PreferencePayload;
  onToggle: (key: PreferenceKey, option: string) => void;
  onSubmit: () => void;
}

export function PreferenceSelectionPanel({
  options,
  value,
  onToggle,
  onSubmit
}: PreferenceSelectionPanelProps) {
  return (
    <section className="preference-section">
      <div className="preference-header">
        <h2>Recommendation Preferences</h2>
        <p>Select multiple options to prepare recommendation input for chatbot.</p>
      </div>

      <div className="preference-grid">
        {(Object.keys(options) as PreferenceKey[]).map((key) => (
          <fieldset key={key} className="preference-group">
            <legend>{GROUP_LABELS[key]}</legend>
            <div className="preference-options">
              {options[key].map((option) => {
                const checkboxId = `${key}-${option}`;
                return (
                  <label className="preference-option" key={option} htmlFor={checkboxId}>
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={value[key].includes(option)}
                      onChange={() => onToggle(key, option)}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="preference-actions">
        <button type="button" className="preference-submit" onClick={onSubmit}>
          Generate Recommendation
        </button>
      </div>
    </section>
  );
}
