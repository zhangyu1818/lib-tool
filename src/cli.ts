#!/usr/bin/env node

import yParser from 'yargs-parser'
import slash from 'slash2'
import { build } from './index'

const args = yParser(process.argv.slice(2))

if (args.v || args.version) {
  console.log(require('../package').version)
  process.exit(0)
}

const { entry, mode, outDir, format } = args

const cwd = slash(process.cwd())
build({ cwd, entry, mode, outDir, format }).catch((error) => {
  throw error
})
