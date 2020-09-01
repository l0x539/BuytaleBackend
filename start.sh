#!/bin/bash
export SESS_SECRET=$(cat .env)
DEBUG=buytalebackend:* npm start
