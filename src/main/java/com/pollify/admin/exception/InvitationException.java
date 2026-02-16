package com.pollify.admin.exception;

/**
 * Exception thrown for invitation-related errors
 */
public class InvitationException extends RuntimeException {
    
    public InvitationException(String message) {
        super(message);
    }
    
    public InvitationException(String message, Throwable cause) {
        super(message, cause);
    }
}
