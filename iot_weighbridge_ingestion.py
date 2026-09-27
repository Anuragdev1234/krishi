import time
import json
import random
import urllib.request
import urllib.error

"""
IoT Electronic Weighbridge & Digital Moisture Meter Edge Ingestion Script.
Connects via RS-232 / TCP-IP socket to physical digital weighing indicator,
calibrates tare and gross readings, and posts directly to SAP-QMP API gateway.
"""

MANDI_API_ENDPOINT = "http://localhost:5173/api/operator/weighment"
WEIGHBRIDGE_ID = "WB-UP-LKO-01"

def read_rs232_serial_indicator(port="/dev/ttyUSB0", baudrate=9600):
    """
    Simulates reading calibrated streaming weight data from industrial indicator
    (e.g., Avery Weight-Tronix / Mettler Toledo indicator).
    """
    # Simulated reading
    simulated_tare_kg = 3850.0  # Empty tractor trolley tare
    simulated_gross_kg = 12350.0 # Loaded with grain
    net_kg = simulated_gross_kg - simulated_tare_kg
    return {
        "gross_kg": simulated_gross_kg,
        "tare_kg": simulated_tare_kg,
        "net_kg": net_kg,
        "stable": True
    }

def read_digital_moisture_meter():
    """
    Simulates reading NIR (Near-Infrared) spectroscopic grain moisture sensor.
    """
    moisture = round(random.uniform(13.5, 15.5), 1)
    foreign_matter = round(random.uniform(0.6, 1.2), 1)
    return {
        "moisture_percentage": moisture,
        "foreign_matter_percentage": foreign_matter,
        "grade": "GRADE_A" if moisture <= 17.0 else "REJECTED"
    }

def transmit_weighment_slip(token_number):
    print(f"[*] Reading IoT sensors for Token: {token_number}...")
    weight_data = read_rs232_serial_indicator()
    assay_data = read_digital_moisture_meter()

    payload = {
        "weighbridge_id": WEIGHBRIDGE_ID,
        "token_number": token_number,
        "gross_weight_kg": weight_data["gross_kg"],
        "tare_weight_kg": weight_data["tare_kg"],
        "net_weight_kg": weight_data["net_kg"],
        "moisture_percent": assay_data["moisture_percentage"],
        "foreign_matter": assay_data["foreign_matter_percentage"],
        "quality_grade": assay_data["grade"],
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    print(f"[OK] Calibrated readings acquired:")
    print(json.dumps(payload, indent=2))

    try:
        req = urllib.request.Request(
            "http://localhost:5000/api/operator/weighment",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            print(f"[SUCCESS] Remote API accepted IoT weighment slip:")
            print(json.dumps(res_data, indent=2))
    except Exception as e:
        print(f"[ERROR] Failed to post to Mandi API: {e}")

    return payload

if __name__ == "__main__":
    test_token = "TK-UP-2026-0042"
    transmit_weighment_slip(test_token)
