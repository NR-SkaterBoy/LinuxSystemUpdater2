#!/bin/bash

# Developer: NR-SkaterBoy
# Github: https://github.com/NR-SkaterBoy
# E-mail: nr.rick.dev@gmail.com
# Linux Systems source package update

# *** Linux Types *** #
# Supported Systems
# Debian base

shell=True

# Linux version ID
. /etc/os-release

# Password

export SUDO_ASKPASS="pass.sh"

case "$ID_LIKE" in
    "debian") # Ubuntu-Kali-Raspbian-Sparky
        if zenity --question --title="APT Update" --text="Would you like to run apt update?" --no-wrap; then
            sudo -A apt update
        fi

        if zenity --question --title="APT Upgrade" --text="Would you like to run apt upgrade?" --no-wrap; then
            sudo -A apt upgrade -y
        fi
        
        if zenity --question --title="APT Autoremove" --text="Would you like to run apt autoremove?" --no-wrap; then
            sudo -A apt autoremove -y
        fi
        sudo -A apt --fix-broken install
    ;;
    *)
        zenity --error --title="Error" --text="Update failed!\nPlease check the supported systems or your internet connection!" --no-wrap
        exit
    ;;
esac

# System restart
rc=1
while [ $rc -eq 1 ]; do 
    ans=$(zenity --info --title 'What is the next step?' \
        --text 'What is the next step?' \
        --ok-label Quit \
        --extra-button Restart \
        --extra-button Shutdown \
    )

    rc=$?
    echo "${rc}-${ans}"
    echo $ans

    if [[ $ans = "Shutdown" ]]
    then
        sudo -A shutdown now
    elif [[ $ans = "Restart" ]]
    then
        sudo -A shutdown -r now
    elif [[ $ans = "Quit" ]]
    then
        exit
    fi
done
