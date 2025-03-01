# NFT Generator

## Installation

1. Clone the repository:
    ```sh
    git clone <repository_url>
    ```

2. Install the required packages:
    ```sh
    npm install
    ```

## Usage

### Generate PSD Files for Verification

1. Run `script.js` to generate PSD files:
    ```sh
    node script.js
    ```

    - Variables:
        - `mintNumber`: Number of PSD files to generate (default: 2000)
        - `sizePercentage`: Size percentage of the canvas (default: 100)

    ```

### Generate PNG Files

1. Run `min.js` to generate PNG files:
    ```sh
    node min.js
    ```

    - Variables:
        - `mintNumber`: Number of PNG files to generate (default: 2000)
        - `sizePercentage`: Size percentage of the canvas (default: 100)

## Notes
- First run with script.js will generate rarityDataExport.xlsx , update and rename `ratings.xlsx`
- Ensure that the `ratings.xlsx` file is present in the root directory before running the scripts.
- The generated PSD files will be saved in the `./psd` directory.
- The generated PNG files will be saved in the `./images` directory.