#!/bin/bash

# ------------------------------------------------
# ------------------ VARIABLES -------------------

RED="#E95378"
GREEN="#29D398"
BLUE="#26BBD9"
WHITE=${main_color}
ORANGE="#F09483"

# ------------------------------------------------
# -------------------- SCRIPT --------------------

[[ $(groups | grep docker | wc -l) -eq 1 ]] && DOCKER="docker" || DOCKER="sudo docker"
# PASS=$(gum input --password --placeholder "your user password" --header "Sudo password to run docker" --header.foreground "$WHITE")# if [[ $(groups | grep docker | wc -l) -eq 1 ]]


CHOICE=$(gum choose --cursor.foreground "$ORANGE" --item.faint "Build" "Start" "Stop" "Exit" --header "What do you want to do with the Farmer?" --header.foreground "$WHITE")

if [[ $CHOICE == "Build" ]]
then
  gum spin -s line --title "Taking container down ..." -- $DOCKER compose down
  gum spin -s line --title "Rebuilding container ..." -- $DOCKER compose up -d --build
  if [[ $($DOCKER container ls | grep server-app | wc -l) -eq 1 ]]
  then
    echo "Container correctly $(gum style --foreground "$GREEN" --bold "UP")"
  else
    echo "$(gum style --foreground "$RED" --bold "Something went wrong") ... Aborting"
    exit 1
  fi
elif [[ $CHOICE == "Start" ]]
then
  if [[ $($DOCKER container ls | grep server-app | wc -l) -eq 1 ]]
  then
    REBUILD=$(gum choose --cursor.foreground "$ORANGE" --item.faint "Yes" "No" --header "The Farmer container is already $(gum style --foreground "$GREEN" --bold "UP"), do you want to rebuild it?" --header.foreground "$WHITE")
    if [[ $REBUILD == "Yes" ]]
    then
      gum spin -s line --title "Taking container down ..." -- $DOCKER compose down
      gum spin -s line --title "Rebuilding container ..." -- $DOCKER compose up -d --build
    fi
  else
    gum spin -s line --title "Building container ..." -- $DOCKER compose up -d
  fi
  if [[ $($DOCKER container ls | grep server-app | wc -l) -eq 1 ]]
  then
    echo "Container correctly $(gum style --foreground "$GREEN" --bold "UP")"
  else
    echo "$(gum style --foreground "$RED" --bold "Something went wrong") ... Aborting"
    exit 1
  fi
elif [[ $CHOICE == "Stop" ]]
then
  if [[ $($DOCKER container ls | grep server-app | wc -l) -eq 1 ]]
  then
    gum spin -s line --title "Stopping and removing container ..." -- $DOCKER compose down
  fi
  echo "Container correctly $(gum style --foreground "$RED" --bold "DOWN")"
fi

echo "Bye  :snake:" | gum format -t emoji | gum style --align center --padding "1 6"
