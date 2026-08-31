import pyowm
import matplotlib.pyplot as plt
import pytz
from datetime import datetime


# =========================================================
# API KEY
# =========================================================

API_KEY = "b809b1991a58f25fc6c1c175e19eb2e8"

owm = pyowm.OWM(API_KEY)
mgr = owm.weather_manager()


# =========================================================
# PART 1: CURRENT WEATHER IN PARIS
# =========================================================

try:
    print("=" * 50)
    print("WEATHER INFORMATION FOR PARIS")
    print("=" * 50)

    observation = mgr.weather_at_place("Paris, FR")
    weather = observation.weather

    temperature = weather.temperature("celsius")["temp"]
    wind = weather.wind()
    sunrise = weather.sunrise_time(timeformat="date")
    sunset = weather.sunset_time(timeformat="date")

    print(f"Temperature: {temperature}°C")
    print(f"Weather: {weather.detailed_status}")

    print("\nWind Information")
    print(f"Wind speed: {wind.get('speed', 'N/A')} m/s")
    print(f"Wind direction: {wind.get('deg', 'N/A')}°")

    print("\nSun Information")
    print(f"Sunrise: {sunrise.strftime('%H:%M')}")
    print(f"Sunset: {sunset.strftime('%H:%M')}")

except Exception as e:
    print(f"Error fetching Paris weather: {e}")


# =========================================================
# PART 2: ASK USER FOR A LOCATION
# =========================================================

city = input("\nEnter a city: ")


try:

    # Get weather using city name
    observation = mgr.weather_at_place(city)
    weather = observation.weather

    # Get city information
    location = observation.location

    city_name = location.name
    country = location.country

    # Get city ID
    city_id = location.id

    # Get coordinates
    latitude = location.lat
    longitude = location.lon

    print("\n" + "=" * 50)
    print(f"WEATHER INFORMATION FOR {city_name.upper()}")
    print("=" * 50)

    print(f"Country: {country}")
    print(f"City ID: {city_id}")
    print(f"Latitude: {latitude}")
    print(f"Longitude: {longitude}")

    # Current temperature
    temperature = weather.temperature("celsius")["temp"]

    print(f"\nTemperature: {temperature}°C")
    print(f"Weather: {weather.detailed_status}")
    print(f"Humidity: {weather.humidity}%")


    # =====================================================
    # WIND
    # =====================================================

    wind = weather.wind()

    print("\nWind Information")
    print("-" * 30)
    print(f"Wind speed: {wind.get('speed', 'N/A')} m/s")
    print(f"Wind direction: {wind.get('deg', 'N/A')}°")


    # =====================================================
    # SUNRISE AND SUNSET
    # =====================================================

    sunrise = weather.sunrise_time(timeformat="date")
    sunset = weather.sunset_time(timeformat="date")

    print("\nSun Information")
    print("-" * 30)
    print(f"Sunrise: {sunrise.strftime('%H:%M')}")
    print(f"Sunset: {sunset.strftime('%H:%M')}")


    # =====================================================
    # PART 3: GET WEATHER USING CITY ID
    # =====================================================

    observation_id = mgr.weather_at_id(city_id)
    weather_id = observation_id.weather

    print("\nWeather successfully retrieved using City ID!")


    # =====================================================
    # PART 4: FIVE-DAY FORECAST
    # =====================================================

    forecast = mgr.forecast_at_id(city_id, "3h")

    print("\n" + "=" * 50)
    print("5-DAY WEATHER FORECAST")
    print("=" * 50)

    for forecast_weather in forecast.forecast_weathers:

        date = forecast_weather.reference_time(
            timeformat="date"
        )

        temperature = forecast_weather.temperature(
            "celsius"
        )["temp"]

        humidity = forecast_weather.humidity

        status = forecast_weather.detailed_status

        print(
            f"{date.strftime('%d/%m/%Y %H:%M')} | "
            f"{temperature}°C | "
            f"Humidity: {humidity}% | "
            f"{status}"
        )


    # =====================================================
    # PART 5: AIR POLLUTION
    # =====================================================

    air_mgr = owm.airpollution_manager()

    air = air_mgr.air_quality_at_coords(
        lat=latitude,
        lon=longitude
    )

    print("\n" + "=" * 50)
    print("AIR POLLUTION INFORMATION")
    print("=" * 50)

    print(air)


    # =====================================================
    # PART 6: PREPARE THREE-DAY DATA FOR GRAPH
    # =====================================================

    dates = []
    temperatures = []
    humidities = []

    for forecast_weather in forecast.forecast_weathers:

        date = forecast_weather.reference_time(
            timeformat="date"
        )

        # Take one forecast around midday
        if date.hour == 12:

            temperature = forecast_weather.temperature(
                "celsius"
            )["temp"]

            humidity = forecast_weather.humidity

            dates.append(date)
            temperatures.append(temperature)
            humidities.append(humidity)

            # We only need three days
            if len(dates) == 3:
                break


    # =====================================================
    # PART 7: INITIALIZE THE PLOT
    # =====================================================

    def init_plot():

        plt.ylabel("Temperature (°C)")

        plt.xlabel("Date")

        plt.title(
            f"3-Day Weather Forecast for {city_name}"
        )


    # =====================================================
    # PART 8: PLOT TEMPERATURES
    # =====================================================

    def plot_temperatures():

        positions = range(len(temperatures))

        plt.bar(
            positions,
            temperatures,
            width=0.6
        )

        labels = []

        for date in dates:

            labels.append(
                date.strftime("%d/%m")
            )

        plt.xticks(
            positions,
            labels
        )


    # =====================================================
    # PART 9: DISPLAY HUMIDITY ON THE BAR CHART
    # =====================================================

    def write_humidity_on_bar_chart():

        for index in range(len(temperatures)):

            plt.text(
                index,
                temperatures[index] + 0.5,
                f"{humidities[index]}%",
                ha="center",
                va="bottom"
            )


    # =====================================================
    # PART 10: STYLE THE BAR CHART
    # =====================================================

    def style_plot():

        plt.xlabel("Date")
        plt.ylabel("Temperature (°C)")

        plt.title(
            f"3-Day Weather Forecast for {city_name}"
        )

        plt.grid(
            axis="y",
            linestyle="--",
            alpha=0.5
        )

        plt.xticks(rotation=0)

        plt.tight_layout()


    # =====================================================
    # PART 11: DISPLAY THE GUI
    # =====================================================

    init_plot()

    plot_temperatures()

    write_humidity_on_bar_chart()

    style_plot()

    plt.show()


# =========================================================
# ERROR HANDLING
# =========================================================

except Exception as error:

    print("\nSorry, we could not find the weather information.")

    print("Please check:")
    print("1. The city name")
    print("2. Your OpenWeatherMap API key")
    print("3. Your internet connection")

    print("\nError:", error)
