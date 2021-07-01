package jajobackend.controller.listeners;

import lombok.Data;

@Data
public class BasicListener {

    public void onPrePersist(Object object) {}
    public void onPostPersist(Object object) { }
    public void onPostLoad(Object object) {}
    public void onPreUpdate(Object object) {}
    public void onPostUpdate(Object object) {}
    public void onPreRemove(Object object) {}
    public void onPostRemove(Object object) {}
}
