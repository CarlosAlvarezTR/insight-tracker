document.addEventListener('DOMContentLoaded', () => {
  // --- Get references for initial navigation ---
  const initialChoicesSection = document.getElementById('initial-choices');
  const usabilityButton = document.getElementById('btn-usability');
  const foundationalButton = document.getElementById('btn-foundational');

  const usabilityOptionsSection = document.getElementById('usability-options');
  const foundationalOptionsSection = document.getElementById('foundational-options');

  const backButtons = document.querySelectorAll('.back-button'); // Get all back buttons

  // --- Code for Foundational Insights Scoring (elements defined early for clearAllErrors) ---
  const insightTextInput = document.getElementById('insight-text');
  const productNameInput = document.getElementById('product-name');
  const scoreJtbdInput = document.getElementById('score-jtbd');
  const scoreEfficiencyInput = document.getElementById('score-efficiency');
  const scoreDelightInput = document.getElementById('score-delight');
  const calculateFoundationalButton = document.getElementById('btn-calculate-foundational');
  const foundationalResultDiv = document.getElementById('foundational-result');

  // Get references to the error message spans for Foundational Insights
  const errorJtbdSpan = document.getElementById('error-jtbd');
  const errorEfficiencySpan = document.getElementById('error-efficiency');
  const errorDelightSpan = document.getElementById('error-delight');

  // --- Code for Usability Issues Scoring ---
  const calculateUsabilityButton = document.getElementById('btn-calculate-usability');
  const usabilityResultDiv = document.getElementById('usability-result');
  const affectedUsersInput = document.getElementById('affected-users');
  const totalParticipantsInput = document.getElementById('total-participants');
  const frequencyNaInput = document.getElementById('na-frequency');
  const frequencyErrorSpan = document.getElementById('error-frequency');
  const usabilityFields = [
      {
          input: document.getElementById('score-ease-impact'),
          na: document.getElementById('na-ease-impact'),
          error: document.getElementById('error-ease-impact'),
          label: 'ease of use impact'
      },
      {
          input: document.getElementById('score-complexity-impact'),
          na: document.getElementById('na-complexity-impact'),
          error: document.getElementById('error-complexity-impact'),
          label: 'perceived complexity impact'
      },
      {
          input: document.getElementById('score-onboarding-impact'),
          na: document.getElementById('na-onboarding-impact'),
          error: document.getElementById('error-onboarding-impact'),
          label: 'tool onboarding impact'
      }
  ];

  // --- Helper function to clear all individual error messages, input styles, and results ---
  function clearAllErrors() {
      // Clear Foundational Insight errors
      if (errorJtbdSpan) errorJtbdSpan.textContent = '';
      if (errorEfficiencySpan) errorEfficiencySpan.textContent = '';
      if (errorDelightSpan) errorDelightSpan.textContent = '';
      
      if (foundationalResultDiv) foundationalResultDiv.innerHTML = ''; // Clear the main result

      // Remove error styling from Foundational Insight inputs
      if (scoreJtbdInput) scoreJtbdInput.classList.remove('input-error');
      if (scoreEfficiencyInput) scoreEfficiencyInput.classList.remove('input-error');
      if (scoreDelightInput) scoreDelightInput.classList.remove('input-error');
      
      // Clear Usability Issue errors and result
      usabilityFields.forEach(field => {
          if (field.error) field.error.textContent = '';
          if (field.input) field.input.classList.remove('input-error');
      });
      if (frequencyErrorSpan) frequencyErrorSpan.textContent = '';
      if (affectedUsersInput) affectedUsersInput.classList.remove('input-error');
      if (totalParticipantsInput) totalParticipantsInput.classList.remove('input-error');
      if (usabilityResultDiv) usabilityResultDiv.innerHTML = '';
  }
  
  // --- Function to display an error for a specific input ---
  function displayError(inputElement, errorSpan, message) {
      if (errorSpan) errorSpan.textContent = message;
      if (inputElement) inputElement.classList.add('input-error');
  }

  // --- Function to show initial choices and hide others ---
  function showInitialChoices() {
      if (usabilityOptionsSection) usabilityOptionsSection.classList.add('hidden');
      if (foundationalOptionsSection) foundationalOptionsSection.classList.add('hidden');
      if (initialChoicesSection) initialChoicesSection.classList.remove('hidden');
      
      clearAllErrors(); // Clear any errors or results from previous sections
  }

  // --- Event listener for the "Score Usability Issues" button ---
  if (usabilityButton) {
      usabilityButton.addEventListener('click', () => {
          if (initialChoicesSection) initialChoicesSection.classList.add('hidden');
          if (usabilityOptionsSection) usabilityOptionsSection.classList.remove('hidden');
          if (foundationalOptionsSection) foundationalOptionsSection.classList.add('hidden');
          clearAllErrors(); // Clear any errors from other sections
      });
  }

  // --- Event listener for the "Score Foundational Insights" button ---
  if (foundationalButton) {
      foundationalButton.addEventListener('click', () => {
          if (initialChoicesSection) initialChoicesSection.classList.add('hidden');
          if (foundationalOptionsSection) foundationalOptionsSection.classList.remove('hidden');
          if (usabilityOptionsSection) usabilityOptionsSection.classList.add('hidden');
          clearAllErrors(); // Clear any errors from other sections
      });
  }

  // --- Event listeners for all "Go Back" buttons ---
  backButtons.forEach(button => {
      button.addEventListener('click', () => {
          showInitialChoices();
      });
  });

  // Keep N/A controls and their paired inputs synchronized.
  usabilityFields.forEach(field => {
      if (!field.input || !field.na) return;

      field.na.addEventListener('change', () => {
          field.input.disabled = field.na.checked;
          if (field.na.checked) {
              field.input.value = '';
              field.input.classList.remove('input-error');
              if (field.error) field.error.textContent = '';
          }
          if (usabilityResultDiv) usabilityResultDiv.innerHTML = '';
      });

      field.input.addEventListener('input', () => {
          field.input.classList.remove('input-error');
          if (field.error) field.error.textContent = '';
          if (usabilityResultDiv) usabilityResultDiv.innerHTML = '';
      });
  });

  if (frequencyNaInput && affectedUsersInput && totalParticipantsInput) {
      frequencyNaInput.addEventListener('change', () => {
          const isUnavailable = frequencyNaInput.checked;
          affectedUsersInput.disabled = isUnavailable;
          totalParticipantsInput.disabled = isUnavailable;
          if (isUnavailable) {
              affectedUsersInput.value = '';
              totalParticipantsInput.value = '';
              affectedUsersInput.classList.remove('input-error');
              totalParticipantsInput.classList.remove('input-error');
              if (frequencyErrorSpan) frequencyErrorSpan.textContent = '';
          }
          if (usabilityResultDiv) usabilityResultDiv.innerHTML = '';
      });

      [affectedUsersInput, totalParticipantsInput].forEach(input => {
          input.addEventListener('input', () => {
              affectedUsersInput.classList.remove('input-error');
              totalParticipantsInput.classList.remove('input-error');
              if (frequencyErrorSpan) frequencyErrorSpan.textContent = '';
              if (usabilityResultDiv) usabilityResultDiv.innerHTML = '';
          });
      });
  }

  // --- Logic for Usability Issues Calculate Button ---
  if (calculateUsabilityButton) {
      calculateUsabilityButton.addEventListener('click', () => {
          clearAllErrors();
          let isValid = true;
          const observations = [];
          const unavailableMeasures = [];

          if (frequencyNaInput && frequencyNaInput.checked) {
              observations.push(null);
              unavailableMeasures.push('frequency');
          } else {
              const affectedUsers = Number(affectedUsersInput?.value);
              const totalParticipants = Number(totalParticipantsInput?.value);
              const validCounts = Number.isInteger(affectedUsers)
                  && Number.isInteger(totalParticipants)
                  && affectedUsers >= 0
                  && totalParticipants > 0
                  && affectedUsers <= totalParticipants;

              if (!validCounts) {
                  if (frequencyErrorSpan) {
                      frequencyErrorSpan.textContent = 'Enter whole-number counts, with affected users no greater than total participants, or select N/A.';
                  }
                  affectedUsersInput?.classList.add('input-error');
                  totalParticipantsInput?.classList.add('input-error');
                  isValid = false;
                  observations.push(null);
              } else {
                  observations.push(affectedUsers / totalParticipants * 5);
              }
          }

          usabilityFields.forEach(field => {
              if (!field.input || !field.na || !field.error) {
                  isValid = false;
                  return;
              }

              if (field.na.checked) {
                  observations.push(null);
                  unavailableMeasures.push(field.label);
                  return;
              }

              const value = Number(field.input.value);
              if (!Number.isInteger(value) || value < 0 || value > 5) {
                  displayError(field.input, field.error, 'Please enter a whole number between 0 and 5, or select N/A.');
                  isValid = false;
                  observations.push(null);
                  return;
              }

              observations.push(value);
          });

          if (!isValid) return;

          const availableObservations = observations.filter(value => value !== null);
          if (availableObservations.length === 0) {
              usabilityResultDiv.innerHTML = `
                  <p><strong>Severity unavailable</strong></p>
                  <p>Enter at least one observation to calculate severity.</p>`;
              return;
          }

          const observationalAverage = availableObservations.reduce((sum, value) => sum + value, 0)
              / availableObservations.length;
          const severity = observationalAverage >= 4
              ? { level: 1, label: 'Critical issue' }
              : observationalAverage >= 3
                  ? { level: 2, label: 'Major issue' }
                  : observationalAverage >= 2
                      ? { level: 3, label: 'Moderate issue' }
                      : { level: 4, label: 'Minor issue' };
          const isNormalized = unavailableMeasures.length > 0;

          usabilityResultDiv.innerHTML = `
              <p class="severity-result"><strong>${severity.level} — ${severity.label}</strong></p>
              <p><strong>${isNormalized ? 'Normalized ' : ''}observational average:</strong> ${formatScore(observationalAverage)} / 5</p>
              ${isNormalized ? `<p class="formula-note">Calculated from ${availableObservations.length} of 4 factors. Excluded as N/A: ${unavailableMeasures.join(', ')}.</p>` : '<p class="formula-note">All four observational factors are equally weighted.</p>'}`;
      });
  }

  function formatScore(value) {
      return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }

  // --- Logic for Foundational Insights Calculate Button ---
  if (calculateFoundationalButton) {
      calculateFoundationalButton.addEventListener('click', () => {
          clearAllErrors(); // Clear previous errors and results first
          let isValid = true; // Flag to track overall validity

          // 1. Get and validate JTBD Score
          let scoreJtbd = NaN;
          if (scoreJtbdInput && errorJtbdSpan) { // Ensure input and its error span exist
              scoreJtbd = parseInt(scoreJtbdInput.value, 10);
              if (isNaN(scoreJtbd) || scoreJtbd < 0 || scoreJtbd > 5) {
                  displayError(scoreJtbdInput, errorJtbdSpan, 'Please enter a number between 0 and 5.');
                  isValid = false;
              }
          } else if (scoreJtbdInput) { // Input exists but error span might not (less ideal)
              console.warn("JTBD score input found, but its error span 'error-jtbd' is missing.");
              isValid = false; 
          } else { 
              isValid = false; 
              console.warn("JTBD score input 'score-jtbd' not found.");
          }

          // 2. Get and validate Efficiency Score
          let scoreEfficiency = NaN;
          if (scoreEfficiencyInput && errorEfficiencySpan) {
              scoreEfficiency = parseInt(scoreEfficiencyInput.value, 10);
              if (isNaN(scoreEfficiency) || scoreEfficiency < 0 || scoreEfficiency > 5) {
                  displayError(scoreEfficiencyInput, errorEfficiencySpan, 'Please enter a number between 0 and 5.');
                  isValid = false;
              }
          } else if (scoreEfficiencyInput) {
              console.warn("Efficiency score input found, but its error span 'error-efficiency' is missing.");
              isValid = false;
          } else {
               isValid = false;
               console.warn("Efficiency score input 'score-efficiency' not found.");
          }

          // 3. Get and validate Delight Score
          let scoreDelight = NaN;
          if (scoreDelightInput && errorDelightSpan) {
              scoreDelight = parseInt(scoreDelightInput.value, 10);
              if (isNaN(scoreDelight) || scoreDelight < 0 || scoreDelight > 5) {
                  displayError(scoreDelightInput, errorDelightSpan, 'Please enter a number between 0 and 5.');
                  isValid = false;
              }
          } else if (scoreDelightInput) {
               console.warn("Delight score input found, but its error span 'error-delight' is missing.");
               isValid = false;
          } else {
              isValid = false;
              console.warn("Delight score input 'score-delight' not found.");
          }

          // 4. If any validation failed, stop
          if (!isValid) {
              // Optional: A general message in the main result area if any error occurs
              // if (foundationalResultDiv) {
              // foundationalResultDiv.innerHTML = `<p style="color: red;">Please correct the errors above before calculating.</p>`;
              // }
              return;
          }

          // 5. Calculate the total score (only if all inputs are valid)
          const totalScore = scoreJtbd + scoreEfficiency + scoreDelight;

          // 6. Determine the impact level
          let impactLevel = '';
          if (totalScore >= 12 && totalScore <= 15) {
              impactLevel = '1 - High impact';
          } else if (totalScore >= 8 && totalScore <= 11) {
              impactLevel = '2 - Moderate impact';
          } else if (totalScore >= 4 && totalScore <= 7) {
              impactLevel = '3 - Low impact';
          } else if (totalScore >= 0 && totalScore <= 3) {
              impactLevel = '0 - No impact';
          } else {
              // This case should ideally not be reached if min/max on inputs and the JS validation works
              impactLevel = 'Score out of expected range. Please check inputs.'; 
          }

          // 7. Display the result
          if (foundationalResultDiv) {
              // const insightTextValue = insightTextInput ? insightTextInput.value : "N/A"; // Example of getting insight text
              // const productNameValue = productNameInput ? productNameInput.value : "N/A"; // Example
              foundationalResultDiv.innerHTML = `
                  <p><strong>Total Score:</strong> ${totalScore}</p>
                  <p><strong>Impact Level:</strong> ${impactLevel}</p>`;
          } else {
              console.warn("Foundational result div 'foundational-result' not found.");
          }
      });
  } else {
      // console.warn("Calculate button 'btn-calculate-foundational' not found.");
      // This warning can be noisy if you have other pages without this button,
      // so it's commented out but useful during development.
  }

  // Initially, ensure only the main choices are visible.
  // Call showInitialChoices to set the correct initial state if sections are not hidden by CSS default
  // showInitialChoices(); // Uncomment if your CSS doesn't hide sections by default or if you need to ensure errors are cleared on load.
  // It's generally better if CSS handles the initial hidden state.
});
