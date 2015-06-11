#!/bin/bash
docker build -t bbsfa/conference .
docker run bbsfa/conference:latest
