'use strict';

/* ------------------------------------------------------------------
   Virtual Dog Park - Round 3
   Adds growth stages, saved progress (localStorage) and Start Over.
   ------------------------------------------------------------------ */

const STORAGE_KEY = 'virtualDogParkPetV1';

const STAGE_MIN_DAY = 1;
const STAGE_YOUNG_FROM_DAY = 2;
const STAGE_ADULT_FROM_DAY = 4;

const START_DAY = 1;
const START_HAPPINESS = 50;
const MAX_HAPPINESS = 100;
const MIN_HAPPINESS = 0;
const CARE_STEP = 10;
const DAY_COST = 5;

const NAME_MAX_LENGTH = 20;

const BREEDS = [
  {
    id: 'beagle',
    name: 'Beagle',
    image: 'assets/beagle.svg',
    notes: 'A small scent hound. Needs a daily walk and loves following its nose.'
  },
  {
    id: 'golden-retriever',
    name: 'Golden Retriever',
    image: 'assets/golden-retriever.svg',
    notes: 'Friendly and eager to please. Brush the coat a few times a week.'
  },
  {
    id: 'poodle',
    name: 'Poodle',
    image: 'assets/poodle.svg',
    notes: 'Clever and low shedding. The curly coat needs regular trimming.'
  }
];

const breedList = document.getElementById('breed-list');
const breedSelect = document.getElementById('dog-breed');
const adoptionForm = document.getElementById('adoption-form');
const nameInput = document.getElementById('dog-name');
const formMessage = document.getElementById('form-message');

const petPanel = document.getElementById('pet-panel');
const petImage = document.getElementById('pet-image');
const petName = document.getElementById('pet-name');
const petBreed = document.getElementById('pet-breed');
const petDay = document.getElementById('pet-day');
const petStage = document.getElementById('pet-stage');
const stageChip = document.getElementById('stage-chip');
const happinessValue = document.getElementById('happiness-value');
const happinessBar = document.getElementById('happiness-bar');
const happinessMeter = happinessBar.parentElement;
const actionMessage = document.getElementById('action-message');

const confirmBox = document.getElementById('confirm-box');
const confirmName = document.getElementById('confirm-name');

let pet = null;

function stageFor(day) {
  if (day >= STAGE_ADULT_FROM_DAY) {
    return { name: 'Adult Dog', className: 'stage-adult' };
  }
  if (day >= STAGE_YOUNG_FROM_DAY) {
    return { name: 'Young Dog', className: 'stage-young' };
  }
  return { name: 'Puppy', className: 'stage-puppy' };
}

function clamp(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function findBreed(id) {
  for (let i = 0; i < BREEDS.length; i += 1) {
    if (BREEDS[i].id === id) {
      return BREEDS[i];
    }
  }
  return BREEDS[0];
}

function renderEncyclopedia() {
  breedList.textContent = '';

  for (let i = 0; i < BREEDS.length; i += 1) {
    const breed = BREEDS[i];

    const card = document.createElement('article');
    card.className = 'breed-card';

    const image = document.createElement('img');
    image.src = breed.image;
    image.alt = 'Illustration of a ' + breed.name;
    image.width = 120;
    image.height = 120;

    const title = document.createElement('h3');
    title.textContent = breed.name;

    const notes = document.createElement('p');
    notes.textContent = breed.notes;

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(notes);
    breedList.appendChild(card);
  }
}

function renderBreedOptions() {
  for (let i = 0; i < BREEDS.length; i += 1) {
    const option = document.createElement('option');
    option.value = BREEDS[i].id;
    option.textContent = BREEDS[i].name;
    breedSelect.appendChild(option);
  }
}

function renderPet() {
  if (pet === null) {
    petPanel.hidden = true;
    confirmBox.hidden = true;
    return;
  }

  const breed = findBreed(pet.breed);
  const stage = stageFor(pet.day);

  petImage.src = breed.image;
  petImage.alt = pet.name + ' the ' + breed.name + ', at the ' + stage.name + ' stage';
  petImage.className = 'pet-image ' + stage.className;

  petName.textContent = pet.name;
  petBreed.textContent = breed.name;
  petDay.textContent = String(pet.day);
  petStage.textContent = stage.name;
  stageChip.textContent = stage.name;

  happinessValue.textContent = String(pet.happiness);
  happinessBar.style.width = pet.happiness + '%';
  happinessMeter.setAttribute('aria-valuenow', String(pet.happiness));

  petPanel.hidden = false;
}

function showMessage(element, text, isError) {
  element.textContent = text;
  element.className = isError ? 'message is-error' : 'message';
}

function savePet() {
  if (pet === null) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  } catch (error) {
    showMessage(actionMessage, 'This browser blocked local storage, so progress will not be saved.', true);
  }
}

function loadPet() {
  let raw = null;

  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }

  if (raw === null) {
    return null;
  }

  let parsed = null;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return null;
  }

  if (parsed === null || typeof parsed !== 'object' || typeof parsed.name !== 'string') {
    return null;
  }

  const day = Number(parsed.day);
  const happiness = Number(parsed.happiness);

  return {
    name: parsed.name,
    breed: typeof parsed.breed === 'string' ? parsed.breed : BREEDS[0].id,
    day: Number.isFinite(day) && day >= STAGE_MIN_DAY ? Math.floor(day) : START_DAY,
    happiness: Number.isFinite(happiness)
      ? clamp(Math.floor(happiness), MIN_HAPPINESS, MAX_HAPPINESS)
      : START_HAPPINESS
  };
}

function clearSavedPet() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    return;
  }
}

function adoptDog(event) {
  event.preventDefault();

  const name = nameInput.value.trim();

  if (name.length === 0) {
    showMessage(formMessage, 'Please enter a name before adopting.', true);
    nameInput.focus();
    return;
  }

  if (name.length > NAME_MAX_LENGTH) {
    showMessage(formMessage, 'The name must be ' + NAME_MAX_LENGTH + ' characters or fewer.', true);
    nameInput.focus();
    return;
  }

  pet = {
    name: name,
    breed: breedSelect.value,
    day: START_DAY,
    happiness: START_HAPPINESS
  };

  showMessage(formMessage, '');
  showMessage(actionMessage, name + ' has moved in. Day 1, Puppy stage, happiness ' + START_HAPPINESS + '.');

  confirmBox.hidden = true;
  nameInput.value = '';

  savePet();
  renderPet();
}

function addHappiness(amount, label) {
  if (pet === null) {
    return;
  }
  pet.happiness = clamp(pet.happiness + amount, MIN_HAPPINESS, MAX_HAPPINESS);
  showMessage(actionMessage, label + ' Happiness is now ' + pet.happiness + '.');
  savePet();
  renderPet();
}

function feedDog() {
  if (pet === null) {
    return;
  }
  addHappiness(CARE_STEP, pet.name + ' enjoyed the meal.');
}

function playDog() {
  if (pet === null) {
    return;
  }
  addHappiness(CARE_STEP, pet.name + ' loved the play session.');
}

function goToNextDay() {
  if (pet === null) {
    return;
  }

  pet.day = pet.day + 1;
  pet.happiness = clamp(pet.happiness - DAY_COST, MIN_HAPPINESS, MAX_HAPPINESS);

  const stage = stageFor(pet.day);
  showMessage(
    actionMessage,
    'It is now Day ' + pet.day + '. ' + pet.name + ' is a ' + stage.name + ' and happiness is ' + pet.happiness + '.'
  );

  savePet();
  renderPet();
}

function askStartOver() {
  if (pet === null) {
    return;
  }
  confirmName.textContent = pet.name;
  confirmBox.hidden = false;
  showMessage(actionMessage, 'Choose Cancel to keep ' + pet.name + ', or Confirm to delete the saved progress.');
}

function cancelStartOver() {
  confirmBox.hidden = true;
  showMessage(actionMessage, pet === null ? '' : pet.name + ' is staying.');
}

function confirmStartOver() {
  if (pet === null) {
    return;
  }

  const oldName = pet.name;
  clearSavedPet();
  pet = null;
  confirmBox.hidden = true;
  showMessage(actionMessage, 'Progress deleted. ' + oldName + ' is no longer saved in this browser.');
  renderPet();
  nameInput.focus();
}

renderEncyclopedia();
renderBreedOptions();

pet = loadPet();
renderPet();

if (pet !== null) {
  showMessage(actionMessage, 'Welcome back. ' + pet.name + ' is on Day ' + pet.day + ' with happiness ' + pet.happiness + '.');
}

adoptionForm.addEventListener('submit', adoptDog);
document.getElementById('feed-button').addEventListener('click', feedDog);
document.getElementById('play-button').addEventListener('click', playDog);
document.getElementById('next-day-button').addEventListener('click', goToNextDay);
document.getElementById('start-over-button').addEventListener('click', askStartOver);
document.getElementById('cancel-start-over').addEventListener('click', cancelStartOver);
document.getElementById('confirm-start-over').addEventListener('click', confirmStartOver);
