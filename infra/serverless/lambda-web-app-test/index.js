import fetch from "node-fetch"

export const handler = async(event) => {
    console.log("Event", event)

    var location = event.location

    let api_key = "WJ27TXZRYWGJJ8WD93BSJ37EP"
    let include = ""
    if (event.include == "yes") { include = "&include=hours" }
    var weather_api_url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + event.location + "/next7days?" +
        "unitGroup=" + event.unitGroup.toLowerCase() +
        "&key=" + api_key + include

    const api_response = await fetch(weather_api_url);
    const data_json = await api_response.json();

    var filtered_weather_data = []
    var i, j
    for (i = 1; i < data_json.days.length; i++) {
        var date = data_json.days[i].datetime;
        for (j = 0; j < data_json.days[i].hours.length; j++) {
            filtered_weather_data.push({
                "date": date,
                "time": data_json.days[i].hours[j].datetime,
                "conditions": data_json.days[i].hours[j].conditions,
                "temperature": data_json.days[i].hours[j].temp,
                "feelsLike": data_json.days[i].hours[j].feelslike,
                "humidity": data_json.days[i].hours[j].humidity,
                "precipitation": data_json.days[i].hours[j].precip,
                "windSpeed": data_json.days[i].hours[j].windspeed
            })
        }
    }
    // TODO implement
    const response = {
        body: filtered_weather_data
    };
    return response;
};