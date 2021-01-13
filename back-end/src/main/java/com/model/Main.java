package com.model;

public class Main {
    public static void main(String[] args) {
        Boolean showState = Boolean.FALSE;
        if (args.length >= 2 && (args[1].equals("-v") || args[1].equals("-verbose")))
        { showState = Boolean.TRUE; }
        Admin admin = new Admin();
        admin.processInstructions(showState);
    }
}