#!/bin/bash
cd /home/kavia/workspace/code-generation/easycalc-16562-2972bb18/easycalc_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

