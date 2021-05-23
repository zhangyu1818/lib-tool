#!/usr/bin/env node

import yParser from 'yargs-parser'
import slash from 'slash2'
import { build } from './index'

const args = yParser(process.argv.slice(2))

if (args.v || args.version) {
  console.log(require('../package').version)
  process.exit(0)
}

const cwd = slash(process.cwd())
build({ cwd })
