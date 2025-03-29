package com.cookBook.service;

import java.util.regex.Pattern;

public class EmailValidation {
    static boolean isEmailValid(String emailToCheck) {
        return Pattern.matches("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$", emailToCheck);
    }
}