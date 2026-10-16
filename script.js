'use strict';

/* ------------------------------------------------------------------
   Virtual Dog Park - Round 1
   The dog encyclopedia: three breeds, each with an illustration and
   short care notes.
   ------------------------------------------------------------------ */

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

renderEncyclopedia();
