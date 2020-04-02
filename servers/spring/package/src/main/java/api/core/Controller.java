package api.core;

/*
 * Author: Rungsiman Nararatwong
 * Contact: rungsiman@gmail.com
 *
 * RESTful web service controller
 * See Spring documentation for more information about RESTful web service project structure
 *
 * In Spring’s approach to building RESTful web services, HTTP requests are handled by a controller.
 * This API platform calls third-party packages via classes in ../connectors/.
 * To add a new third-party package, create a class in ../connectors/ and map the newly created class to @RequestMapping.
 *
 * More information:
 * Spring RESTful web service: https://spring.io/guides/gs/rest-service/
 *
 * */

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import api.connectors.CoreNLPConnector;
import java.util.ArrayList;

@RestController
public class Controller {

    public CoreNLPConnector coreNLPConnector;

    public Controller() {
        coreNLPConnector = new CoreNLPConnector();
    }

    @RequestMapping("/status")
    public Status status() {
        return new Status();
    }

    @RequestMapping("/openie/triples")
    public ArrayList<String[]> getOpenIETripples(@RequestParam(name="text", defaultValue="Barack Obama born in Hawaii. Hawaii locates in USA.") String text) {
        return coreNLPConnector.getTriples(text);
    }
}
