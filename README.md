# Virtual Dog Park

A dog encyclopedia and virtual pet website built for the AIE1101 Week 5 Lab 2 (Visual Lab).
The site is plain HTML, CSS and vanilla JavaScript with no build step and no external
dependencies, so it runs straight from a local server.

## Features

- **Dog encyclopedia** - Beagle, Golden Retriever and Poodle, each with a local SVG
  illustration and short care notes.
- **Adoption** - choose a breed, enter a non-empty name of at most 20 characters, then
  adopt one dog. Leading and trailing spaces are removed and the name is always rendered
  as text, never as HTML.
- **Starting state** - Day 1, Puppy stage, happiness 50.
- **Feed and Play** - each adds 10 happiness, capped at 100.
- **Next Day** - simulates time: +1 day and -5 happiness, never below 0.
- **Growth** - Day 1 is Puppy, Days 2-3 are Young Dog, Day 4 onward is Adult Dog. The dog
  illustration grows with the stage.
- **Saved progress** - the adopted dog is stored in `localStorage` under the key
  `virtualDogParkPetV1`, so a refresh restores the latest name, breed, day and happiness
  in the same browser and device.
- **Start Over** - asks for confirmation first. Cancel keeps the dog; Confirm deletes the
  saved progress.
- **Narrow screen** - the layout, form and card all reflow for phone-sized widths.

## How to run

1. Open this folder in VS Code.
2. Install the **Live Server** extension (Ritwick Dey) if you have not already.
3. Right-click `index.html` and choose **Open with Live Server**.
4. A local address such as `http://127.0.0.1:5500` opens in your browser.

Storage is scoped to the browser and the local address, so keep both the same while
testing save and load.

## Files

```
virtual-dog-park/
├── index.html                       page structure
├── style.css                        layout and appearance
├── script.js                        breeds, pet state, growth and storage
├── README.md
├── .gitignore
└── assets/
    ├── beagle.svg
    ├── golden-retriever.svg
    └── poodle.svg
```

## Growth rules

| Day | Stage |
|-----|-------|
| 1 | Puppy |
| 2-3 | Young Dog |
| 4 and later | Adult Dog |

## Notes

Storage uses `localStorage`, which is not an online account: progress stays on one browser
and one device. The AI assistant wrote the first draft of the code, but every feature was
inspected, run and tested in the browser before it was committed.
