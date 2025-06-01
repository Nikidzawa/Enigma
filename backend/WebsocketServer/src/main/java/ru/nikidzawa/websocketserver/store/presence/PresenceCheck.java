package ru.nikidzawa.websocketserver.store.presence;

/**
 * @author Nikidzawa
 */
public class PresenceCheck {
    Long userTargetId;

    public Long getUserTargetId() {
        return userTargetId;
    }

    public void setUserTargetId(Long userTargetId) {
        this.userTargetId = userTargetId;
    }

    public PresenceCheck(Long userTargetId) {
        this.userTargetId = userTargetId;
    }
}
