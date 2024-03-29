import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            // CJS is not for front-end
            // {
            //     file: packageJson.main,
            //     format: "cjs",
            //     sourcemap: true,
            // },
            // Commented out, because there was an error compiling visio-guest :
            // Attempted import error: 'useId' is not exported from 'react' (imported as 'e').
            // but uncommented, subsequent were not building.. need to sort this out...
            // maybe to build visio-guest it is enough to just remove dist/esm directory ?
            // After further testing not sure what the problem initially was because
            // I now can compile with this
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
            {
                file: 'dist/mui-react-lib.production.min.js',
                format: "umd",
                sourcemap: true,
                name: 'ApiRtcMuiReactLib',
                globals: {
                    'react': 'React',
                    // 'react/jsx-runtime': 'React.jsx',
                    // '@mui/material': 'MaterialUI',
                    '@apirtc/apirtc': 'apiRTC',
                    //'@apirtc/react-lib': 'ApiRtcReactLib', //commented out because there should NOT be a dependency on it
                    '@mui/material/Box': 'MaterialUI.Box',
                    '@mui/material/Chip': 'MaterialUI.Chip',
                    '@mui/material/CircularProgress': 'MaterialUI.CircularProgress',
                    '@mui/material/FormControl': 'MaterialUI.FormControl',
                    '@mui/material/FormControlLabel': 'MaterialUI.FormControlLabel',
                    '@mui/material/FormLabel': 'MaterialUI.FormLabel',
                    '@mui/material/Grid': 'MaterialUI.Grid',
                    '@mui/material/Icon': 'MaterialUI.Icon',
                    '@mui/material/IconButton': 'MaterialUI.IconButton',
                    '@mui/material/InputLabel': 'MaterialUI.InputLabel',
                    '@mui/material/MenuItem': 'MaterialUI.MenuItem',
                    '@mui/material/Radio': 'MaterialUI.Radio',
                    '@mui/material/RadioGroup': 'MaterialUI.RadioGroup',
                    '@mui/material/Select': 'MaterialUI.Select',
                    '@mui/material/Stack': 'MaterialUI.Stack',
                    '@mui/material/Tooltip': 'MaterialUI.Tooltip',
                    '@mui/material/styles': 'MaterialUI',
                    // '@mui/material/utils': 'MaterialUI.utils',
                    // '@mui/icons-material/Mic (guessing 'MicIcon')
                    // '@mui/icons-material/MicOff (guessing 'MicOffIcon')
                    // '@mui/icons-material/VolumeUp (guessing 'VolumeUpIcon')
                    // '@mui/icons-material/VolumeOff (guessing 'VolumeOffIcon')
                    // '@mui/icons-material/CameraAlt (guessing 'CameraAltIcon')
                    // '@mui/icons-material/FlashlightOff (guessing 'FlashlightOffIcon')
                    // '@mui/icons-material/FlashlightOn (guessing 'FlashlightOnIcon')
                }
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser()
        ],
        //external: ["react", "react-dom", "@apirtc/apirtc"] // peerDepsExternal already sets this ?
    },
    {
        input: "dist/esm/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
    },
];
