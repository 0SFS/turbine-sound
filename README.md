# Turbine sound

Reusable procedural turbofan synthesis for engine mods, including the existing FJ33 and F135 profiles. Profiles, telemetry mappings and installation metadata come from engine mods; this package contains the common synthesis algorithm.

The `procedural-jet-v1` renderer runs as an independent, import-free WASM module under the `osfs-engine-voice-v1` contract from `@0sfs/engine-sound`. The `sound` host supplies timestamped inputs and mixes its source and airframe outputs. It owns spatialization and the final limiter. Ordinary aircraft profile changes require data changes in the engine mod, not a copied generator.

Synthesis preserves the previous C++ turbine algorithm during extraction, including independent shaft tones, fan/bypass noise, combustion, exhaust and burned-fuel-driven afterburner shaping. Timbre and loudness remain approximate; these are original synthesis controls, not measured spectra. New numeric kernels use Rust/WebAssembly with a TypeScript reference.

## Use and build

The component manifest at `public/0sfs-mod.json` advertises the renderer, compatible telemetry schemas and verified WASM hash. Engine mods depend on `0SFS/turbine-sound` and select the renderer in their acoustic profile. The package exports `./profile` for parameter validation/encoding and `./assets` for bundler-safe asset URLs.

Run `npm install`, then `npm run build:wasm` with Emscripten 6.0.9 installed. The shared build helper resolves headers from the installed `@0sfs/engine-sound` dependency. Its source checkout can be elsewhere; an adjacent checkout is the local `file:` dependency default. The output is `public/audio/turbine-sound/voice.wasm`, with a source/toolchain receipt alongside it and the hash updated in the manifest. `npm run verify:wasm` verifies all three agree.

From `fly`, `npm run verify:audio` checks host and family artifacts. The existing sound tests exercise the shipped modules; the extraction regression compares legacy and modular waveforms across FJ33, F135 and IO320 traces.

## Community

- [Code of conduct](https://github.com/0SFS/.github/blob/main/CODE_OF_CONDUCT.md)
- [Contributing](https://github.com/0SFS/.github/blob/main/CONTRIBUTING.md)
- [License](LICENSE)
- [Security](https://github.com/0SFS/.github/blob/main/SECURITY.md)
