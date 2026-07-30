import React, { useMemo, useState } from "react";
import {
  SafAlert,
  SafBadge,
  SafButton,
  SafCard,
  SafCheckbox,
  SafContainer,
  SafDisclosure,
  SafDivider,
  SafNumberField,
  SafText,
} from "@thomsonreuters/saffron-core-components-prototyping-only/react";

const ratingError = "Incorrect number. Enter a whole number between 0 and 5, or select N/A.";

const foundationalDimensions = [
  { id: "jtbd", label: "Customer goal or task", question: "How strongly does this insight explain the customer’s ability to accomplish an existing goal or task?", hint: "0 = no meaningful connection · 3 = useful understanding · 5 = critical understanding" },
  { id: "efficiency", label: "Task or process efficiency", question: "How strongly does this insight reveal an opportunity to improve task or process efficiency?", hint: "0 = no efficiency implications · 3 = meaningful friction · 5 = major friction" },
  { id: "delight", label: "Customer satisfaction or delight", question: "How strongly does this insight explain what affects customer satisfaction or delight?", hint: "0 = no meaningful effect · 3 = noticeable effect · 5 = major effect" },
];

const usabilityDimensions = [
  { id: "ease", label: "Ease of use impact", question: "Impact on ease of use", hint: "0 = no observed impact · 3 = noticeable friction · 5 = extremely difficult or blocked" },
  { id: "complexity", label: "Perceived complexity impact", question: "Impact on perceived complexity", hint: "0 = no concern · 3 = more complex than expected · 5 = unnecessarily complex" },
  { id: "onboarding", label: "Tool onboarding impact", question: "Impact on tool onboarding", hint: "0 = no concern · 3 = learning requires effort · 5 = very difficult onboarding" },
];

const emptyRatings = (dimensions) => Object.fromEntries(dimensions.map(({ id }) => [id, { value: "", na: false }]));
const validRating = (value) => value !== "" && Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 5;
const formatScore = (value) => Number.isInteger(value) ? String(value) : value.toFixed(1);

function RatingField({ index, item, state, onChange }) {
  const invalid = state.value !== "" && !validRating(state.value);
  return (
    <SafCard className="dimension-card" appearance="vertical" density="standard" headingLevel={3}>
      <div className="dimension-heading">
        <SafBadge appearance="info-light">{String(index + 1).padStart(2, "0")}</SafBadge>
        <div>
          <SafText appearance="body-strong-lg">{item.question}</SafText>
          <SafText appearance="body-default-sm" className="subtle">{item.hint}</SafText>
        </div>
      </div>
      <div className="field-row">
        <SafNumberField
          id={`score-${item.id}`}
          label="Impact rating"
          placeholder="0–5"
          step={1}
          value={state.value}
          disabled={state.na}
          invalid={invalid}
          validationMessage={invalid ? ratingError : ""}
          onInput={(event) => onChange({ ...state, value: event.currentTarget.value })}
        />
        <SafCheckbox
          id={`na-${item.id}`}
          checked={state.na}
          onChange={(event) => onChange({ value: "", na: event.currentTarget.checked })}
        >Not assessed (N/A)</SafCheckbox>
      </div>
    </SafCard>
  );
}

function TrackHeader({ eyebrow, title, description, onBack }) {
  return (
    <>
      <div className="top-actions"><SafButton appearance="tertiary" onClick={onBack}>← Back to insight types</SafButton></div>
      <div className="track-heading">
        <SafText appearance="eyebrow-heavy-md" className="eyebrow">{eyebrow}</SafText>
        <SafText appearance="heading-xl">{title}</SafText>
        <SafText appearance="body-default-lg" className="subtle intro-copy">{description}</SafText>
      </div>
      <SafAlert appearance="informational">Use your research notes for context. This tool calculates a consistent recommendation; it does not replace researcher judgment.</SafAlert>
    </>
  );
}

function Result({ title, scoreLine, impactLine, note, actionLabel, onReset }) {
  return (
    <SafAlert appearance="success" className="result-alert">
      <div className="result-content" aria-live="polite">
        <SafText appearance="eyebrow-heavy-sm">Recommended impact score (to put in ADO)</SafText>
        <SafText appearance="heading-lg">{title}</SafText>
        <SafText appearance="body-strong-md">{scoreLine}</SafText>
        {impactLine && <SafText appearance="body-strong-md">{impactLine}</SafText>}
        <SafText appearance="body-default-sm">{note}</SafText>
        <SafButton appearance="secondary" onClick={onReset}>{actionLabel}</SafButton>
      </div>
    </SafAlert>
  );
}

function FoundationalTrack({ onBack }) {
  const [ratings, setRatings] = useState(() => emptyRatings(foundationalDimensions));
  const [result, setResult] = useState(null);
  const values = Object.values(ratings);
  const hasInvalid = values.some(({ value, na }) => !na && value !== "" && !validRating(value));
  const hasNumber = values.some(({ value, na }) => !na && validRating(value));
  const canCalculate = hasNumber && !hasInvalid;

  const reset = () => { setRatings(emptyRatings(foundationalDimensions)); setResult(null); };
  const calculate = () => {
    if (!canCalculate) return;
    const available = foundationalDimensions.filter(({ id }) => validRating(ratings[id].value)).map(({ id }) => Number(ratings[id].value));
    const unavailable = foundationalDimensions.filter(({ id }) => ratings[id].na).map(({ label }) => label);
    const total = (available.reduce((sum, value) => sum + value, 0) / available.length) * 3;
    const impact = total >= 12 ? "1 — High impact" : total >= 8 ? "2 — Moderate impact" : total >= 4 ? "3 — Low impact" : "0 — No impact";
    setResult({ total, impact, unavailable, count: available.length });
  };

  return (
    <section className="track-page">
      <TrackHeader eyebrow="Foundational insight track" title="Measure strategic insight impact" description="Rate how strongly an insight advances understanding across three foundational dimensions." onBack={onBack} />
      <div className="dimensions-list">
        {foundationalDimensions.map((item, index) => <RatingField key={item.id} index={index} item={item} state={ratings[item.id]} onChange={(next) => { setRatings({ ...ratings, [item.id]: next }); setResult(null); }} />)}
      </div>
      <SafDivider />
      <div className="form-actions">
        <div><SafButton id="btn-calculate-foundational" appearance="primary" disabled={!canCalculate} onClick={calculate}>Calculate impact</SafButton></div>
        {!hasNumber && <SafText appearance="body-default-sm" className="subtle">Enter at least one rating from 0–5 to calculate impact.</SafText>}
      </div>
      {result && <Result title={result.impact} scoreLine={`${result.unavailable.length ? "Normalized total" : "Total score"}: ${formatScore(result.total)} / 15`} note={result.unavailable.length ? `Calculated from ${result.count} of 3 dimensions. Excluded as N/A: ${result.unavailable.join(", ")}.` : "All three dimensions are equally weighted."} actionLabel="Score another insight" onReset={reset} />}
      <SafDisclosure summary="How foundational scoring works">
        <div className="disclosure-copy"><SafText appearance="body-default-md">Applicable dimensions are averaged equally and normalized to a 15-point scale. High impact begins at 12, moderate at 8, and low at 4. N/A dimensions do not lower the score.</SafText></div>
      </SafDisclosure>
    </section>
  );
}

function UsabilityTrack({ onBack }) {
  const [ratings, setRatings] = useState(() => emptyRatings(usabilityDimensions));
  const [frequency, setFrequency] = useState({ affected: "", total: "", na: false });
  const [result, setResult] = useState(null);
  const values = Object.values(ratings);
  const countsEntered = frequency.affected !== "" || frequency.total !== "";
  const countsValid = frequency.affected !== "" && frequency.total !== "" && Number.isInteger(Number(frequency.affected)) && Number.isInteger(Number(frequency.total)) && Number(frequency.affected) >= 0 && Number(frequency.total) > 0 && Number(frequency.affected) <= Number(frequency.total);
  const frequencyInvalid = !frequency.na && countsEntered && !countsValid;
  const ratingsInvalid = values.some(({ value, na }) => !na && value !== "" && !validRating(value));
  const hasNumber = (!frequency.na && countsValid) || values.some(({ value, na }) => !na && validRating(value));
  const canCalculate = hasNumber && !frequencyInvalid && !ratingsInvalid;

  const reset = () => { setRatings(emptyRatings(usabilityDimensions)); setFrequency({ affected: "", total: "", na: false }); setResult(null); };
  const calculate = () => {
    if (!canCalculate) return;
    const observations = [];
    const unavailable = [];
    if (frequency.na) unavailable.push("Frequency"); else if (countsValid) observations.push(Number(frequency.affected) / Number(frequency.total) * 5);
    usabilityDimensions.forEach(({ id, label }) => { if (ratings[id].na) unavailable.push(label); else if (validRating(ratings[id].value)) observations.push(Number(ratings[id].value)); });
    const average = observations.reduce((sum, value) => sum + value, 0) / observations.length;
    const severity = average >= 4 ? { level: 1, label: "Critical issue" } : average >= 3 ? { level: 2, label: "Major issue" } : average >= 2 ? { level: 3, label: "Moderate issue" } : { level: 4, label: "Minor issue" };
    setResult({ average, severity, unavailable, count: observations.length });
  };

  return (
    <section className="track-page">
      <TrackHeader eyebrow="Usability issue track" title="Measure observed usability severity" description="Combine study frequency with evidence-based impact ratings to generate a severity recommendation." onBack={onBack} />
      <div className="dimensions-list">
        <SafCard className="dimension-card" appearance="vertical" density="standard" headingLevel={3}>
          <div className="dimension-heading"><SafBadge appearance="info-light">01</SafBadge><div><SafText appearance="body-strong-lg">How frequently did the issue occur?</SafText><SafText appearance="body-default-sm" className="subtle">The observed proportion is converted to a 0–5 rating.</SafText></div></div>
          <div className="frequency-grid">
            <SafNumberField id="affected-users" label="Participants affected" placeholder="e.g., 3" min={0} step={1} value={frequency.affected} disabled={frequency.na} invalid={frequencyInvalid} validationMessage={frequencyInvalid ? "Use whole-number counts. Affected participants cannot exceed the total." : ""} onInput={(event) => { setFrequency({ ...frequency, affected: event.currentTarget.value }); setResult(null); }} />
            <SafNumberField id="total-participants" label="Total participants" placeholder="e.g., 10" min={1} step={1} value={frequency.total} disabled={frequency.na} invalid={frequencyInvalid} validationMessage={frequencyInvalid ? "Enter a total greater than zero." : ""} onInput={(event) => { setFrequency({ ...frequency, total: event.currentTarget.value }); setResult(null); }} />
            <SafCheckbox id="na-frequency" checked={frequency.na} onChange={(event) => { setFrequency({ affected: "", total: "", na: event.currentTarget.checked }); setResult(null); }}>Not assessed (N/A)</SafCheckbox>
          </div>
        </SafCard>
        {usabilityDimensions.map((item, index) => <RatingField key={item.id} index={index + 1} item={item} state={ratings[item.id]} onChange={(next) => { setRatings({ ...ratings, [item.id]: next }); setResult(null); }} />)}
      </div>
      <SafDivider />
      <div className="form-actions">
        <div><SafButton id="btn-calculate-usability" appearance="primary" disabled={!canCalculate} onClick={calculate}>Calculate impact</SafButton></div>
        {!hasNumber && <SafText appearance="body-default-sm" className="subtle">Enter at least one complete observation to calculate impact.</SafText>}
      </div>
      {result && <Result title={`${result.severity.level} — ${result.severity.label}`} scoreLine={`${result.unavailable.length ? "Normalized observational average" : "Observational average"}: ${formatScore(result.average)} / 5`} note={result.unavailable.length ? `Calculated from ${result.count} of 4 factors. Excluded as N/A: ${result.unavailable.join(", ")}.` : "All four observational factors are equally weighted."} actionLabel="Score another issue" onReset={reset} />}
      <SafDisclosure summary="How usability scoring works">
        <div className="disclosure-copy"><SafText appearance="body-default-md">Frequency and the three impact ratings are averaged equally. An average of 4–5 is critical, 3–less than 4 is major, 2–less than 3 is moderate, and below 2 is minor. N/A factors are excluded.</SafText></div>
      </SafDisclosure>
    </section>
  );
}

function PathSelection({ onSelect }) {
  return (
    <section className="selection-page">
      <div className="hero-copy">
        <SafText appearance="eyebrow-heavy-md" className="eyebrow">Research operations toolkit</SafText>
        <SafText appearance="heading-3xl">Turn research evidence into a clear impact score</SafText>
        <SafText appearance="body-default-lg" className="subtle hero-description">Choose the framework that matches your finding. Each path creates a consistent recommendation ready to add to ADO.</SafText>
      </div>
      <div className="path-grid">
        <SafCard className="path-card" appearance="vertical" density="standard" headingLevel={2}>
          <SafBadge appearance="info-light">Observed friction</SafBadge>
          <SafText appearance="heading-lg">Usability issues</SafText>
          <SafText appearance="body-default-md" className="subtle">Score an issue based on study frequency, ease of use, perceived complexity, and onboarding impact.</SafText>
          <SafButton id="btn-usability" appearance="secondary" onClick={() => onSelect("usability")}>Score a usability issue</SafButton>
        </SafCard>
        <SafCard className="path-card" appearance="vertical" density="standard" headingLevel={2}>
          <SafBadge appearance="success-light">Strategic learning</SafBadge>
          <SafText appearance="heading-lg">Foundational insights</SafText>
          <SafText appearance="body-default-md" className="subtle">Score an insight based on customer goals, efficiency opportunities, and satisfaction or delight.</SafText>
          <SafButton id="btn-foundational" appearance="secondary" onClick={() => onSelect("foundational")}>Score a foundational insight</SafButton>
        </SafCard>
      </div>
      <SafAlert appearance="neutral">Not sure which path to use? Choose usability for an observed interaction problem. Choose foundational for broader learning about customer needs or opportunities.</SafAlert>
    </section>
  );
}

export default function App() {
  const [track, setTrack] = useState(null);
  const content = useMemo(() => track === "usability" ? <UsabilityTrack onBack={() => setTrack(null)} /> : track === "foundational" ? <FoundationalTrack onBack={() => setTrack(null)} /> : <PathSelection onSelect={setTrack} />, [track]);
  return <main><div className="brand-band"><SafContainer maxWidth="xl" centered><SafText appearance="body-strong-md">Research Insight Scorer</SafText><SafText appearance="body-default-sm">Product Design Research</SafText></SafContainer></div><SafContainer maxWidth="lg" centered>{content}</SafContainer></main>;
}
