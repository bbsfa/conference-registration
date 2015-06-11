#!/bin/bash
docker build -t bbsfa/conference .
docker run -d bbsfa/conference:latest
