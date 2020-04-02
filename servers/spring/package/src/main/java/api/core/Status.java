package api.core;

/*
 * Author: Rungsiman Nararatwong
 * Contact: rungsiman@gmail.com
 */

/*
 * API Status check via REST request
 * Accessible at [API domain]/status
 * Any status checks for third-party packages should also be defined here.
 */

public class Status {

    private final String rest_status;

    public Status() {
        rest_status = "OK";
    }

    public String getStatus() {
        return rest_status;
    }
}
