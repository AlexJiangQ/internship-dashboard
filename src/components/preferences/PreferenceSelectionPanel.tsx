import type { PreferencePayload } from "../../types/dashboard";

interface PreferenceSelectionPanelProps {
  value: PreferencePayload;
  skillsOptions: string[];
  durationOptions: readonly string[];
  jobDirectionOptions: readonly string[];
  availableJobPositions: string[];
  displayedWorkNatureOptions: string[];
  showJobPositionPlaceholder: boolean;
  showWorkNaturePlaceholder: boolean;
  showAllWorkNature: boolean;
  canShowAllWorkNatureToggle: boolean;
  onSkillToggle: (option: string) => void;
  onDurationChange: (duration: string) => void;
  onJobDirectionToggle: (direction: string) => void;
  onJobPositionToggle: (position: string) => void;
  onWorkNatureToggle: (workNature: string) => void;
  onToggleShowAllWorkNature: () => void;
  onSubmit: () => void;
}

export function PreferenceSelectionPanel({
  value,
  skillsOptions,
  durationOptions,
  jobDirectionOptions,
  availableJobPositions,
  displayedWorkNatureOptions,
  showJobPositionPlaceholder,
  showWorkNaturePlaceholder,
  showAllWorkNature,
  canShowAllWorkNatureToggle,
  onSkillToggle,
  onDurationChange,
  onJobDirectionToggle,
  onJobPositionToggle,
  onWorkNatureToggle,
  onToggleShowAllWorkNature,
  onSubmit
}: PreferenceSelectionPanelProps) {
  return (
    <section className="preference-section">
      <div className="preference-header">
        <h2>Recommendation Preferences</h2>
        <p>
          Provide student preference and internship preference inputs for recommendation.
        </p>
      </div>

      <section className="preference-block">
        <h3 className="preference-block-title">Student Preference</h3>
        <div className="preference-grid">
          <fieldset className="preference-group">
            <legend>Skills</legend>
            <div className="preference-options">
              {skillsOptions.map((option) => {
                const optionId = `skills-${option}`;
                return (
                  <label className="preference-option" key={option} htmlFor={optionId}>
                    <input
                      id={optionId}
                      type="checkbox"
                      checked={value.skills.includes(option)}
                      onChange={() => onSkillToggle(option)}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="preference-group">
            <legend>Preferred Duration</legend>
            <div className="preference-options">
              {durationOptions.map((option) => {
                const optionId = `duration-${option}`;
                return (
                  <label className="preference-option" key={option} htmlFor={optionId}>
                    <input
                      id={optionId}
                      type="radio"
                      name="preferred-duration"
                      checked={value.duration === option}
                      onChange={() => onDurationChange(option)}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="preference-block">
        <h3 className="preference-block-title">Internship Preference</h3>
        <div className="preference-grid">
          <fieldset className="preference-group">
            <legend>Preferred Job Direction</legend>
            <div className="preference-options">
              {jobDirectionOptions.map((option) => {
                const optionId = `direction-${option}`;
                return (
                  <label className="preference-option" key={option} htmlFor={optionId}>
                    <input
                      id={optionId}
                      type="checkbox"
                      checked={value.jobDirections.includes(option)}
                      onChange={() => onJobDirectionToggle(option)}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="preference-group">
            <legend>Preferred Job Position</legend>
            {showJobPositionPlaceholder ? (
              <p className="preference-placeholder">
                Please select Preferred Job Direction first.
              </p>
            ) : (
              <div className="preference-options">
                {availableJobPositions.map((option) => {
                  const optionId = `position-${option}`;
                  return (
                    <label className="preference-option" key={option} htmlFor={optionId}>
                      <input
                        id={optionId}
                        type="checkbox"
                        checked={value.jobPositions.includes(option)}
                        onChange={() => onJobPositionToggle(option)}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>
        </div>

        <div className="preference-grid preference-grid-single">
          <fieldset className="preference-group">
            <legend>Preferred Work Nature</legend>
            {showWorkNaturePlaceholder ? (
              <p className="preference-placeholder">
                Please select Preferred Job Position first.
              </p>
            ) : (
              <>
                {canShowAllWorkNatureToggle ? (
                  <div className="preference-helper-row">
                    <span className="preference-helper-label">
                      {showAllWorkNature
                        ? "Showing all work nature options"
                        : "Showing suggested work nature"}
                    </span>
                    <button
                      type="button"
                      className="preference-toggle-button"
                      onClick={onToggleShowAllWorkNature}
                    >
                      {showAllWorkNature
                        ? "Show suggested work nature only"
                        : "Show all work nature options"}
                    </button>
                  </div>
                ) : null}
                <div className="preference-options">
                  {displayedWorkNatureOptions.map((option) => {
                    const optionId = `work-nature-${option}`;
                    return (
                      <label className="preference-option" key={option} htmlFor={optionId}>
                        <input
                          id={optionId}
                          type="checkbox"
                          checked={value.workNature.includes(option)}
                          onChange={() => onWorkNatureToggle(option)}
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </fieldset>
        </div>
      </section>

      <div className="preference-actions">
        <button type="button" className="preference-submit" onClick={onSubmit}>
          Generate Recommendation
        </button>
      </div>
    </section>
  );
}
