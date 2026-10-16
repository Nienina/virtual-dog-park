'use strict';

/* ------------------------------------------------------------------
   Virtual Dog Park - Round 2
   Adds adoption plus Feed and Play. No growth or saved progress yet.
   ------------------------------------------------------------------ */

const START_HAPPINESS = 50;
const MAX_HAPPINESS = 100;
const MIN_HAPPINESS = 0;
const CARE_STEP = 10;
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
const happinessValue = document.getElementById('happiness-value');
const happinessBar = document.getElementById('happiness-bar');
const happinessMeter = happinessBar.parentElement;
const actionMessage = document.getElementById('action-message');

let pet = null;

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
    return;
  }

  const breed = findBreed(pet.breed);

  petImage.src = breed.image;
  petImage.alt = pet.name + ' the ' + breed.name;
  petName.textContent = pet.name;
  petBreed.textContent = breed.name;

  happinessValue.textContent = String(pet.happiness);
  happinessBar.style.width = pet.happiness + '%';
  happinessMeter.setAttribute('aria-valuenow', String(pet.happiness));

  petPanel.hidden = false;
}

function showMessage(element, text, isError) {
  element.textContent = text;
  element.className = isError ? 'message is-error' : 'message';
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
    happiness: START_HAPPINESS
  };

  showMessage(formMessage, '');
  showMessage(actionMessage, name + ' has moved in with happiness ' + START_HAPPINESS + '.');

  nameInput.value = '';
  renderPet();
}

function addHappiness(amount, label) {
  if (pet === null) {
    return;
  }
  pet.happiness = clamp(pet.happiness + amount, MIN_HAPPINESS, MAX_HAPPINESS);
  showMessage(actionMessage, label + ' Happiness is now ' + pet.happiness + '.');
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

renderEncyclopedia();
renderBreedOptions();
renderPet();

adoptionForm.addEventListener('submit', adoptDog);
document.getElementById('feed-button').addEventListener('click', feedDog);
document.getElementById('play-button').addEventListener('click', playDog);
