# Three Match

A bejeweled/candy crush type game. The aim is to free the medals underneath the ice by matching 3 or more gems of the 
same type. Matching gems on top of ice removes it and once a medal is fully uncovered it is freed.

This game is in development and is being built for a masters project at the University of Birmingham.

Once the game is completed, we will build an AI to play and (hopefully) solve it.

Game rules are detailed below.

<p align="center">
  <img src="https://i.imgur.com/2j0mG6i.png">
</p>

## Getting Started

### Prerequisites

Pygame - install via pip

Python 3.x - install via website or your computer's package manager

Once Python 3 is installed, install pygame
```
pip install pygame
```

or on some machines
```
pip3 install pygame
```

### Installing

To install Gem Island clone the repository to your home directory or wherever you prefer, then run main.py with python.

1. Clone repo: 
```
cd ~/
git clone https://github.com/tombrereton/threematch.git
```

2. Run Gem Island
```
cd ~/threematch
python main.py
```
or
```
cd ~/threematch
python3 main.py
```

3. Depending on if you have a HiDPi screen or not, you can change the `HD_SCALE` variable
in `global_variables.py` under the GUI variables section. Recommended values are between and including 1 and 3.

## Game Rules

#### Gem Types
* 6 gem types (colours).
* 3 bonus types (star, cross, diamond)

#### Bonus Actions
* Star bonus removes all gems of the star gem's type
* The cross bonus removes all gems in the row/column. If the match is horizontal, the row is removed. Vertical 
removes the column.
* The diamond bonus removes the 9 surrounding gems of the diamond gem.

#### Earning Bonuses
* If a bonus gem removes another bonus gem, it also performs its bonus action. This is done recursively.
* 3 or more gems in a succession of the same type is a match.
* 4 gems in a succession earns you a cross bonus.
* 5 gems in a succession earns you a star bonus.
* An intersection of a vertical and horizontal match earns you a diamond bonus.
* If a match generates multiple bonuses only one is generated following the hierarchy: star, cross, bonus.

## Running tests

Pytest is required to run the tests.
 
To install pytest use pip:

1. Install pytest
```
pip install pytest
```

2. Run pytest 

To run the test change into the threematch directory and run pytest.
You need to run pytest as a python command so that it adds the current directory to PYTHONPATH.
```
cd ~/threematch
python -m pytest
```

## Style guide

Refer to the pep-8 website for a consistent style.

[https://www.python.org/dev/peps/pep-0008/](https://www.python.org/dev/peps/pep-0008/)

## Authors

* **Thomas Brereton** 
* **Elliott Davies**

## Acknowledgements

* Project Supervisor: **Claudio Zito** 

## License

The MIT License (MIT)

Copyright (c) 2017 Thomas Brereton Elliott Davies

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

