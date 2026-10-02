# monitor_RH_T
- simple affordable robust Relative Humidity & Temperature (RH & T) monitoring
- monitor RH&T outside and inside a thermotron chamber as well as temps of various items inside the chamber

## current status
*(Updated as the project progresses — reflects the current direction, not final decisions.)*

- **Stage:** research/planning, no hardware ordered yet.
- **Temperature (4–8 channels):** PT1000 RTD probes read via a single [ComWinTop CWT-TM-8PT](https://store.comwintop.com/products/8-channels-pt100-pt1000-rs485-modbus-output-temperature-acquisition-module) 8-channel module, communicating to the Arduino over RS485/Modbus RTU.
- **Humidity (0–2 channels):** a Sensirion SHT40-based RS485/Modbus RTU DIN-rail sensor (e.g. CANADUINO RS485 Modbus SHT40, ±1.8% RH) — same bus/protocol/library as the temperature module; accuracy prioritized over probe-style mounting convenience since RH feeds dew point calculation (see research notes).
- **Key constraints:** no I2C, no IR/non-contact sensing; a protocol is acceptable only if it earns its complexity (Modbus RTU over RS485 was judged worth it for noise resilience + wiring simplicity — and now also lets temp and RH share one bus/library).
- **Compute/logging platform:** [Arduino Opta RS485](https://store.arduino.cc/products/opta-rs485) — built-in RS485/Modbus and wired Ethernet (no WiFi variant), programmable in plain C++. Local logging via USB memory stick (confirmed acceptable in place of a literal SD card); pushes data over wired Ethernet to wherever InfluxDB/DuckDB runs.
- **Known risk:** chamber compressor generates EMI during cooling cycles — hardening plan drafted, not yet validated on real hardware.
- **Documentation confidence:** saved to [docs/](docs/). The RH DIN-rail box's enclosure is now **confirmed vented** (verified directly from product photos — fully louvered case, sensor chip mounted right behind the vents) and its chip is **confirmed SHT40** (silkscreened on the PCB in the same photos). The RH probe fallback (XY-MD04) also has a fully verified manufacturer datasheet with complete Modbus register map. The RTD module's register map is verified only against a closely-related same-maker product (CWT-KWL series), not the exact CWT-TM-8PT SKU — still an open item.
- **Next steps:** confirm the CWT-TM-8PT's own register map once sourced; finalize 2-wire vs. 3-wire RTD probe wiring; pick a specific PT1000 probe listing and USB stick; source RS485/Ethernet cabling; then prototype and empirically test EMI behavior during a compressor cycle.

See [research notes](#research-notes) for full reasoning and [glossary](#glossary) for terminology. See [bill of materials](#bill-of-materials-draft) for the current parts list.

## requirements
| Area | Requirement | Details |
| --- | --- | --- |
| Usability | Simple |  |
| Cost | Affordable |  |
| Reliability | Robust |  |
| operation | Automatic | Run when powered on |
| Reader system | Implementation | Develop in-house (e.g. Arduino), or use a COTS device if cost-effective |
| Logging | Local file | Built-in logging to a file |
| Logging | Database support | database Support, e.g. Influx or Duck |
| Inputs | Relative humidity channels | 0 to 2 |
| Inputs | Temperature channels | 0 to 8 |
| Temp | Accuracy | Target: ±0.5 °C across the operating range; stretch goal: ±0.1 °C |
| Temp | Display resolution | 0.1 °C |
| Temp | Probe lead length | ~ 6 ft |
| Temp (°C) | Operating range | ~ −20 to +65  |
| Temp | Probe mounting | Contact sensor metal taped to target surface |

the open air measurment of RH&T could be a single probe unit

note: some of this is open to adjustment

## constraints
- No I2C — avoid sensors/ADCs that require an I2C bus (e.g. ADS1115, MAX31865, SHT3x/SHT4x, BME280, TMP117).
- No IR / non-contact sensing — all temp sensing must be contact (per probe mounting requirement above).

## comments
- Current system uses a Type K thermocouple with a yellow two-pin mini connector and brown wire.
- Suspected current accuracy: ±1–3 °C.

## glossary
| Term | Meaning |
| --- | --- |
| RH | Relative Humidity |
| T | Temperature |
| RTD | Resistance Temperature Detector — a sensor (often platinum, e.g. PT100/PT1000) whose electrical resistance changes predictably with temperature; linear, stable, good accuracy |
| PT100 / PT1000 | Platinum RTD types with 100 Ω / 1000 Ω resistance at 0 °C |
| NTC | Negative Temperature Coefficient (thermistor) — resistance decreases as temperature increases; cheap, sensitive, but non-linear and needs per-unit calibration |
| Thermistor | A resistor whose resistance varies strongly with temperature (NTC or PTC type); used for temperature sensing |
| PTC | Positive Temperature Coefficient — resistance increases as temperature increases (less common for precision sensing than NTC) |
| Thermocouple | A sensor made of two dissimilar metal wires joined at one end, producing a voltage related to temperature difference; wide range and rugged, but lower accuracy without compensation |
| Type K | A common thermocouple type (Chromel/Alumel), wide range (~ −200 to +1260 °C), moderate accuracy (~±1–2 °C typical) |
| Cold-junction compensation (CJC) | Correction applied to thermocouple readings to account for the temperature at the measurement device's terminals (the "cold junction"), required for accurate thermocouple readings |
| ADC | Analog-to-Digital Converter — converts an analog voltage/resistance signal into a digital value a microcontroller can read |
| ADS1115 | A common external 16-bit I2C ADC module, often used to read sensors with more resolution than a microcontroller's built-in ADC |
| MAX31865 | A dedicated RTD-to-digital converter chip/board, commonly used one-per-channel to read PT100/PT1000 RTDs accurately |
| I2C | Inter-Integrated Circuit — a common 2-wire digital communication protocol used by many sensors (e.g. SHT3x, BME280) |
| SHT3x / SHT4x | Sensirion I2C humidity & temperature sensor families, commonly used for RH measurement |
| BME280 | A common I2C sensor measuring temperature, humidity, and pressure |
| COTS | Commercial Off-The-Shelf — a pre-built product bought rather than custom-developed |
| Thermotron chamber | An environmental test chamber (brand name genericized) used to subject items to controlled temperature/humidity conditions |
| InfluxDB | A time-series database optimized for storing and querying timestamped sensor/metrics data |
| DuckDB | An embedded, file-based analytical database (no server required), suitable for simple local logging |
| Data logger | A device or system that records sensor readings over time, typically to local storage |
| Probe lead | The wire connecting a sensor probe to the measurement/logging device |
| Operating range | The range of temperatures/conditions over which a sensor or device is rated to perform accurately |
| Display resolution | The smallest increment a reading can be shown in (e.g. 0.1 °C), distinct from accuracy |
| Accuracy | How close a measured value is to the true value (vs. resolution, which is just how finely it's displayed) |
| 1-Wire | A digital communication protocol (Dallas/Maxim) that lets multiple sensors share a single data wire (plus ground/power), each addressed by a unique factory-burned ID — simplifies multi-channel wiring vs. one-ADC-channel-per-sensor approaches. Considered for temp sensing (via DS18B20) then ruled out in favor of an analog/no-bus approach, before the project settled on Modbus RTU as an acceptable protocol — see research notes |
| DS18B20 | A common 1-Wire digital temperature sensor: ~±0.5 °C accuracy, up to 12-bit (0.0625 °C) resolution, −55 to +125 °C range, low cost (~$1–2 each); multiple units can share one GPIO pin/bus, no I2C required. Sold as a bare TO-92 chip or as pre-wired waterproof stainless-steel probes (the latter preferred to avoid raw-chip soldering). Earlier candidate, superseded by the PT1000 + Modbus RTU direction once protocols were reconsidered |
| Parasite power (1-Wire) | A wiring mode where a 1-Wire device draws power from the data line itself (2-wire: data + ground, no separate power wire); simplifies wiring but is less reliable over long cable runs or with many devices — a separate 3rd power wire is more robust |
| Pull-up resistor | A resistor connecting a digital data line to the supply voltage so the line reads a defined "high" state when idle; 1-Wire buses require one, and its value affects max cable length/device count |
| TMP117 | A high-precision (±0.1 °C) I2C digital temperature sensor — ruled out due to the no-I2C constraint |
| IR thermopile (e.g. MLX90614) | A non-contact infrared temperature sensor — ruled out since probe mounting must be contact-based |
| DHT22 / AM2302 | A combined temperature + humidity sensor using a single-wire proprietary digital protocol (not I2C, not Dallas 1-Wire compatible — one sensor per data pin); ~±0.5 °C temp accuracy, ~±2% RH accuracy (known to drift beyond this in practice), 0.1 resolution on both, low cost (~$5–10). Earlier choice for RH, superseded by a Modbus RTU/RS485 SHT40-based sensor — see research notes |
| AM2301B | Manufacturer-recommended replacement part for the DHT22/AM2302 — but it's I2C-only, which is why DHT22 wasn't simply swapped for it |
| SHT40 | A Sensirion-made, current-generation digital humidity/temperature sensor chip; higher real-world accuracy than DHT22 (~±1.8% RH, ±0.2 °C typical); available natively as I2C, but also sold pre-integrated on RS485/Modbus RTU carrier boards — the latter is the current RH candidate for this project |
| HIH-4000 series | A Honeywell analog-output RH sensor (no digital bus — just a voltage read via ADC); accuracy ~±3.5% RH best-fit, ±2% RH typical at 50% RH. Was the leading no-protocol RH candidate, but discontinued (Honeywell EOL, last orders May 2025) with no analog successor — see research notes |
| Modbus RTU | A simple, widely-used serial (UART) request/response protocol with CRC error-checking, commonly run over RS485; much lower complexity than a shared-bus timing scheme like 1-Wire — read as request a register, parse the response |
| RS485 | A differential serial electrical standard (twisted-pair, 2-wire A/B) used to carry protocols like Modbus RTU over long cable runs with strong noise rejection (common-mode noise on the pair is rejected by the receiver) |
| Termination resistor | A resistor (typically 120 Ω for RS485) placed across the data pair at each physical end of a bus to absorb signal reflections and reduce communication errors |
| Common-mode noise | Electrical noise that affects both conductors of a signal pair equally; differential receivers (like RS485) reject it because they only respond to the voltage *difference* between the two wires |

## research notes

### Decisions and constraints
- No I2C, no IR/non-contact sensing. See [constraints](#constraints) above.
- A protocol is acceptable if it earns its complexity: evaluated going fully analog/no-protocol (ruling out DS18B20/1-Wire and MAX31865/SPI), but settled on **Modbus RTU over RS485** for the temperature module — it buys noise resilience (CRC-checked messages, differential signaling) and wiring simplicity (one bus serves all channels) in exchange for a protocol that's simple to implement on Arduino (`ModbusMaster` library, no bit-banged timing).
- Known EMI source: the thermotron chamber's **compressor generates electrical noise during cooling cycles** — this is a real, known condition the design must tolerate, not a theoretical risk.

### Temperature: PT1000 RTD read via a single multi-channel Modbus RTU module
- **RTD over thermistor/thermocouple:** linear and accurate enough to hit ±0.5 °C without per-unit calibration curves (unlike thermistors) or cold-junction compensation (unlike thermocouples, which is what's currently in use at ±1–3 °C).
- **PT1000 over PT100:** 10x more resistance change per °C (3.85 vs. 0.385 Ω/°C) makes it much less sensitive to lead-wire resistance error and noise — important given ~6 ft leads and known compressor EMI. A 1 Ω lead error costs ~0.26 °C on PT1000 vs. ~2.6 °C on PT100.
- **Candidate module: [ComWinTop CWT-TM-8PT](https://store.comwintop.com/products/8-channels-pt100-pt1000-rs485-modbus-output-temperature-acquisition-module)** — 8ch, PT100/PT1000 selectable, RS485/Modbus RTU, 2- or 3-wire RTD input, range −180 to +650 °C, accuracy ±0.25 °C, 8–30VDC, DIN-rail, ~$42.50–$57. One box covers the full 4–8 channel range. Arduino side needs only a MAX485-class RS485-to-TTL adapter plus the `ModbusMaster` library — no host PC or drivers.
- **Waveshare checked as an alternative — doesn't make an equivalent product.** Waveshare's RS485/Modbus RTU lineup covers relay modules and a generic 8-channel analog-input (voltage/current) acquisition module, not an RTD-specific module with built-in linearization. Pairing their generic analog-input module with separate per-channel RTD-to-analog converters would reintroduce the "one small board per channel" approach already moved away from, so the ComWinTop (or equivalent dedicated RTD) module remains the better fit.
- **Probe form factor:** pre-wired waterproof PT1000 probes (stainless tip + silicone/PTFE cable) — no bare RTD element soldering.
- **Documentation verified: [docs/CWT-KWL_series_PT100_module_manual.pdf](docs/CWT-KWL_series_PT100_module_manual.pdf).** This is the manual for ComWinTop's closely-related **CWT-KWL** series (2/4/8/16-channel PT100 RS485/Modbus modules, same manufacturer/product family as the CWT-TM-8PT candidate above) — not confirmed identical to the CWT-TM-8PT's own register map, but a real, verified datasheet from the same maker showing the actual design pattern: full Modbus register map (channel 1-16 temperature registers at 40001+, per-channel calibration offset registers, device ID/baud rate registers, all via function code 03/06), worked example Modbus transactions (read temperature, set slave ID, set baud rate), 2-wire vs. 3-wire wiring diagram, and confirms −5000 (0xEC78) as the "sensor disconnected/faulty" sentinel value. Spec match: 6-36VDC, ±0.3 °C accuracy, 2 or 3-wire PT100, 9600 default baud — consistent with what was found for the CWT-TM-8PT, increasing confidence those specs are accurate for the actual purchased module, though the exact register addresses should still be re-confirmed against the CWT-TM-8PT/CWT-MB318C's own manual once sourced (attempts to fetch that specific manual were blocked by rate-limiting — see open items).
- **Open items:** 2-wire vs. 3-wire probe wiring (leaning 3-wire); confirm the CWT-TM-8PT's own Modbus register map matches the CWT-KWL pattern above (not yet independently verified for this exact SKU); once hardware is in hand, empirically validate comms/reading stability during an actual compressor cooling cycle vs. idle.

#### EMI hardening (known noise source: chamber compressor during cooling cycles)
This is a known, real condition — the compressor is expected to generate motor start/run and switching noise during cooling cycles — not a theoretical risk, so it's treated as a hard design input rather than an afterthought.

- **Why the baseline design already helps:** PT1000's larger signal-per-degree (10x PT100) is harder for induced noise to swamp before it reaches the signal-conditioning module. RS485 is differential by design — noise that couples onto both conductors of a twisted pair equally (common-mode noise) is rejected by the receiver, since it only responds to the voltage *difference* between the two wires. Modbus RTU adds a CRC check on every message, so a corrupted read is detected and can be retried rather than silently accepted as a bad temperature value.
- **RS485 bus wiring:**
  - Use **shielded twisted-pair cable** (e.g. Belden 3106A-class or equivalent industrial RS485 cable) for the run between the Arduino's RS485 adapter and the CWT-TM-8PT module — plain unshielded cable is not sufficient this close to compressor noise.
  - **Ground the shield at one end only** (controller end is the usual choice) — grounding both ends creates a ground loop, which *introduces* noise rather than rejecting it.
  - Add **120 Ω termination resistors** across the A/B data lines at both physical ends of the bus to absorb reflections and reduce error rates — relevant here since the controller and the module will typically sit at the two ends of a single cable run.
  - Keep the RS485 cable run physically separated from AC power/compressor wiring where possible (see lead separation below) — don't bundle them in the same conduit or wire loom.
- **RTD probe leads:**
  - Prefer **shielded probe cable** where available — some waterproof PT1000 probes offer a metal braid shield under the outer jacket; this helps reject noise picked up along the ~6 ft lead length.
  - Use **3-wire RTD wiring** into the module rather than 2-wire — beyond the lead-resistance cancellation benefit, the extra wire/connection also reduces susceptibility to noise riding on the lead.
  - **Route/dress RTD leads away from AC power and compressor wiring** — industrial practice suggests at least ~12 inches of separation from AC power conductors; avoid running sensor leads parallel to and bundled with compressor power cabling.
- **Power supply considerations:** the compressor's motor start transients can also couple noise onto shared DC power rails — consider powering the CWT-TM-8PT module and the Arduino/RS485 adapter from a supply with reasonable transient/surge tolerance, and keep sensor-side DC wiring separate from any wiring that shares a circuit with the compressor contactor/motor.
- **Validation, not just theory:** once hardware is built, empirically check behavior during a real compressor cooling cycle vs. idle — log Modbus read failures/retries and apparent temperature noise/spikes during cycling. EMI coupling is highly installation-specific (cable routing, enclosure grounding, chamber construction), so the mitigations above are a starting point to test against, not a guarantee.

### Humidity: Modbus RTU/RS485 SHT40-based sensor — current direction
- HIH-4000 (the obvious analog alternative) is **discontinued** (Honeywell EOL, last orders May 2025, no analog successor — replacement part is I2C). [Honeywell notice](https://sps-support.honeywell.com/s/article/Ob)
- **DHT22/AM2302 — superseded.** Was the earlier pick (single-wire protocol, not I2C, ~±2% RH), but its own manufacturer-recommended replacement part (AM2301B) is I2C-only, and DHT22 is known to drift beyond its stated ±2% RH spec in real-world use, especially at humidity extremes. (DHT22 itself appears to still be in production/stocked by distributors like DigiKey/Mouser/DFRobot — only Adafruit dropped it from their own catalog — so it isn't fully EOL, but the accuracy/drift concern plus the chance to unify onto one interface motivated the switch below.)
- **Non-I2C accuracy ceiling:** ±2% RH is close to the practical floor for analog/non-I2C humidity sensing — tighter specs (e.g. Sensirion's I2C SHT31-D/SHT4x line) generally require I2C.
- **Decision: put RH on the same RS485/Modbus RTU bus as temperature**, rather than mixing in a different single-wire protocol — one interface, one Arduino library (`ModbusMaster`) for both temp and RH.
- **Form factor: probe-style was initially preferred** — easier to mount/position inside the chamber than a DIN-rail box; the open-air unit's form factor matters less, so one probe-style sensor could have covered both.
- **Candidate considered: [XY-MD04](https://www.icstation.com/rs485-temperature-humidity-sensor-transmitter-sht40-metal-waterproof-probe-120c-100rh-modbus-real-time-monitor-p-16403.html)** — metal waterproof probe, built-in SHT40 chip, RS485/Modbus RTU, ±0.3 °C / ±3% RH, −40 to +120 °C / 0–100% RH, 5–28VDC (compatible with the CWT-TM-8PT's power range), built-in EMC anti-interference (relevant given the known compressor noise), ~$7.69–$17 depending on source. Still beats DHT22 on temperature accuracy.
  - **Documentation verified: [docs/XY-MD04_GY21250_Datasheet.pdf](docs/XY-MD04_GY21250_Datasheet.pdf).** Confirms all specs above directly from the manufacturer datasheet, plus: full Modbus register map (temperature at input register 30002, humidity at 30003, both Int16/scale 0.1, function codes 0x03/0x04/0x06/0x10), worked example transactions, exact 4-wire terminal colors (red=VCC, black=GND, yellow=RS485-A, white=RS485-B), probe dimensions (55×15×15mm sensing tip, 100cm lead), and simple ASCII "custom control commands" (e.g. plain-text `READ`, `AUTO`, `TC:`/`HC:` calibration offsets) as an alternative to raw Modbus framing if ever useful for debugging. The datasheet's probe photo shows a sintered/mesh metal tip — a vented design, not sealed, consistent with genuine ambient RH sensing.
- **Form factor decision (revised): DIN-rail box over the probe, for accuracy.** RH/T readings here feed **dew point and dew point margin calculations**, and dew point error grows nonlinearly as RH approaches saturation — a flat ±3% vs ±1.8% RH difference translates to a larger dew-point-margin error exactly in the humidity range most relevant to condensation risk. Accuracy was judged worth the mounting tradeoff, superseding the probe-style preference above.
- **Current candidate: CANADUINO RS485 Modbus SHT40 (DIN-rail)** — ±1.8% RH, ±0.2 °C temp, range −40 to +125 °C / 0–100% RH, 5–30VDC (compatible with the CWT-TM-8PT's 8–30VDC), same 9600 baud/8N1 Modbus defaults as the RTD module, DIN-rail mount, ~C$12.90 (~$9.50 USD).
  - **Enclosure venting: confirmed via actual product photos.** Text sources (chip datasheet, retailer product text) didn't describe the enclosure, but the product photos ([docs/sht40_photo1.webp](docs/sht40_photo1.webp), [docs/sht40_photo2.webp](docs/sht40_photo2.webp), [docs/sht40_photo3.webp](docs/sht40_photo3.webp)) resolve it directly: the case is covered edge-to-edge on every face in long louvered vent slots, and the opened-case photo shows the SHT40 chip mounted right behind the vents with a clear air path — a genuinely vented design, not sealed. Open item closed.
  - **Note: the physical unit is labeled "XY-MD02"**, not "CANADUINO" — the CANADUINO/universal-solder listing is a reseller of this module, not its manufacturer.
  - **Chip variant risk across the wider "XY-MD02" market — but resolved for this specific listing.** Searching "XY-MD02" generically surfaces many cheaper listings ($3.66–$17), but most of those use the older, lower-accuracy SHT20 chip rather than SHT40, and model name alone doesn't guarantee which chip is inside (see lesson below). **This specific CANADUINO/universal-solder unit is confirmed SHT40**, though — the opened-case product photo ([docs/sht40_photo2.webp](docs/sht40_photo2.webp)) shows **"SHT40" silkscreened directly on the PCB itself**, not just claimed in retailer copy. A photo of the actual physical board is a much stronger confirmation than a product description, so this exact listing (~$9.50) is the verified buy — no need for a DIY I2C-to-RS485 bridge to get sourcing certainty, since the $10 pre-built part is now confirmed correct. Decision: buy this listing as-is.
  - **General lesson for buying elsewhere/cheaper later:** don't trust "XY-MD02" as a model name alone to guarantee the SHT40 chip — if ever sourcing a different/cheaper listing, look for a legible PCB photo with the chip silkscreen visible (as was done here), not just the written spec sheet.
- **XY-MD04 remains a noted fallback** if probe-style convenience ends up outweighing the accuracy gain once hardware is in hand, though the enclosure-venting concern that motivated keeping it as a fallback is now resolved in the DIN-rail box's favor.

### Compute & logging platform — decided: Arduino Opta RS485
- **Requirement clarified:** the "Reader system" requirement (Arduino or COTS) doesn't have to literally be Arduino — the real need is something that can (a) poll both Modbus RTU modules over RS485, (b) log locally to an SD card, and (c) be queried by or push to InfluxDB/DuckDB (or similar) running elsewhere. **Explicit constraints: no wireless (WiFi/BT) at all, and no Linux-class OS** — so a Raspberry Pi or similar SBC is ruled out, and a wired-only networking path is required if the device pushes data anywhere itself.
- **How "push to a DB without Linux" actually works:** a bare microcontroller can't run InfluxDB/DuckDB itself, but it doesn't need to — it can send data over a **wired Ethernet** connection (not WiFi) via plain HTTP POST requests to wherever a database server (InfluxDB, or a small script ahead of DuckDB) is already running on the same wired network. This is a proven, common pattern (e.g. Arduino/Teensy + Ethernet library posting to InfluxDB's `/api/v2/write` endpoint) — the microcontroller just needs a wired Ethernet MAC/PHY, not an OS.
- **Candidate 1: [Teensy 4.1](https://www.pjrc.com/store/teensy41.html) + Ethernet adapter.** Has a genuine onboard microSD card slot (true SD storage, matches the requirement exactly) and an onboard Ethernet MAC + PHY chip (DP83825) built into the main board — but the physical RJ45 jack itself is a separate small add-on board (e.g. [SparkFun's Ethernet Adapter for Teensy](https://docs.sparkfun.com/SparkFun_Teensy_Ethernet_Adapter/quickstart/), connected via a short ribbon cable — see photos saved at [docs/teensy_ethernet_assembly.jpg](docs/teensy_ethernet_assembly.jpg) and [docs/teensy_ethernet_ribbon.jpg](docs/teensy_ethernet_ribbon.jpg)). All wired, no wireless involved. Cheap (~$30–$40 for the Teensy + adapter combined). Still needs a separate MAX485-class RS485 adapter module to talk to the Modbus devices (same as a plain Arduino would).
- **Candidate 2: [Arduino Opta RS485](https://store.arduino.cc/products/opta-rs485).** An industrial "micro PLC" with **RS485/Modbus and Ethernet both built directly into the unit** (no separate adapter boards needed for either), explicitly available in a non-wireless variant, DIN-rail housing (fits well alongside the other DIN-rail modules already chosen), and fully programmable in regular Arduino C++ (not locked to ladder logic). **However: confirmed no SD card slot and no exposed SPI pins on any variant** — Arduino's own official logging solution for it is a **USB memory stick**, not an SD card. This does not meet the stated SD card requirement as specified, unless a USB stick is an acceptable substitute. Also notably pricier (~$160–$213) than the Teensy route.

#### ⚠️ Opta variant guide — buy the right SKU
Arduino sells **three Opta variants that look similar but differ in connectivity** — buying the wrong one means missing RS485 entirely. Confirmed against Arduino's own datasheet (SKU: AFX00001-AFX00002-AFX00003):

| Variant | SKU | Ethernet | RS-485 | Wi-Fi / Bluetooth | Use case |
| --- | --- | --- | --- | --- | --- |
| **Opta Lite** | AFX00003 | Yes | **No** | No | Only if you don't need Modbus RTU/RS485 at all — **not this project** |
| **Opta RS485** | **AFX00001** | Yes | **Yes** (half-duplex) | No | **This is the correct one for this project** — Modbus RTU over RS485, no wireless |
| **Opta WiFi** | AFX00002 | Yes | Yes (half-duplex) | Yes (WiFi + BLE) | Has RS485 too, but adds wireless radios this project explicitly doesn't want — avoid even though it technically has RS485 |

**Buying checklist:**
- Confirm **SKU AFX00001**, or the listing explicitly says **"Opta RS485"** (not "Lite" or "WiFi") — the physical units look identical from the outside, the model name/SKU is the only reliable way to tell them apart, especially important when buying used/secondhand where the original packaging may not be included.
- All three variants share identical core hardware otherwise (same STM32H747XI dual-core processor, same 8 analog/digital inputs, same 4 relay outputs, same 12–24VDC supply) — so a used/secondhand unit's price won't necessarily reflect which variant it is; always verify the model before paying.
- If buying used and the seller's photos show the product label, the model name is printed directly on the unit — check that, not just the listing title, in case of a mislabeled resale.
- **Candidate 3 (middle ground): Arduino Mega 2560 + Ethernet shield (w/ microSD slot) + RS485 shield.** Stacks three boards rather than one integrated unit, but shields plug directly onto the Mega's header (no loose ribbon-cable wiring like the Teensy's Ethernet adapter). Gets a genuine SD card (most common Ethernet shields, e.g. W5100/W5200-based, include an onboard microSD slot) — satisfies the literal SD card requirement without the USB-stick compromise. Rough cost: Mega (~$40–50) + Ethernet shield with SD (~$10–18) + RS485 shield (~$10–38) ≈ **~$75–95 total** — meaningfully cheaper than Opta, pricier than bare Teensy, with less rework than hand-wiring separate adapter boards.
- **Candidate 3b: Arduino Uno instead of Mega, same shields.** Uno is cheaper (~$28 vs. Mega's ~$40–50, saving ~$15–20) and still compatible with the same W5100-class Ethernet+SD shield and RS485 shields. **Real tradeoff, not just a free discount:** Uno has only 14 digital I/O pins vs. the Mega's 54, and a single hardware UART vs. the Mega's four — stacking an Ethernet/SD shield (uses SPI) and an RS485 shield (uses a serial/UART connection) together on an Uno leaves little headroom and has a documented quirk (a physical switch is needed on some RS485 shields to disconnect it during sketch upload, since it can conflict with the same serial line used for programming). Mega's extra UARTs and pins exist largely to avoid exactly this kind of contention when stacking multiple shields. Uno is viable and worth it if the ~$20 matters, but Mega is the safer/simpler stacking choice.
- **Reconsidered after shield-stacking felt excessive — looked for a single purpose-built board instead of Arduino-anything.** Searched industrial ESP32-based DIN-rail controllers (Norvi) and dedicated Modbus/Ethernet/SD datalogger products, since the real requirement (poll Modbus, log to SD, push to a DB over wired Ethernet) doesn't require Arduino specifically — just needs to avoid WiFi/BT in practice and avoid a Linux-class OS.
  - **[ICP DAS WISE-5231](https://www.icpdas.com/en/product/WISE-5231)** — purpose-built, has everything (Modbus RTU+TCP, built-in SD, RTC, no ladder logic needed) but **~$1,799** — ruled out immediately on cost, nowhere close to "affordable."
  - **Norvi ESP32 DIN-rail controllers — no single stock model has all three (RS485 + built-in SD + built-in wired Ethernet) together; verified directly against datasheets, not just search summaries, after an initial search result turned out to be wrong.**
    - **NORVI ENET (AE06 series)** — confirmed via its own datasheet: built-in W5500 **wired Ethernet** + built-in **microSD** + RTC, DIN-rail, Arduino/C++ programmable. Has WiFi/BT present (ESP32-WROOM32) but it can simply be left disabled/unconnected in firmware. **Confirmed NOT to have built-in RS-485** — an earlier search summary claimed it did, which didn't hold up against the actual datasheet.
    - **NORVI IIOT (AE04 series, e.g. AE04-I, ~$136)** — confirmed via its own product page: built-in **RS-485** + built-in **microSD** + RTC, DIN-rail, Arduino IDE/C++ programmable. Its expansion port is I2C-based, with **no confirmed built-in or official-expansion path to wired Ethernet** — would need a separate ESP32-compatible W5500 Ethernet breakout wired to the board's own SPI pins (a common, well-documented ESP32+W5500 pattern, but not an official Norvi part).
    - **Net result: no single off-the-shelf Norvi board has all three built in.** The realistic Norvi-based option is **NORVI IIOT AE04-I (~$136) + a small W5500 Ethernet breakout module (~$5–10) wired to its SPI pins** — cheaper than Opta, more purpose-built/industrial than a shield-stacked Arduino, but still requires adding one small board rather than being fully single-unit.
- **Price/capability comparison across all options:**

  | Option | Cost | SD card | Built-in RS485 | Built-in Ethernet | Assembly |
  | --- | --- | --- | --- | --- | --- |
  | Teensy 4.1 + Ethernet adapter + MAX485 module | ~$35–45 | Yes (onboard) | No (add MAX485 module) | No (add adapter board, ribbon cable) | Moderate — loose wiring |
  | Uno + Ethernet shield (w/ SD) + RS485 shield | ~$55–75 | Yes (on shield) | No (add RS485 shield) | Yes (on shield) | Low, but tight on pins/UARTs — possible shield conflicts |
  | **Mega + Ethernet shield (w/ SD) + RS485 shield** | **~$75–95** | Yes (on shield) | No (add RS485 shield) | Yes (on shield) | Low — shields stack directly, ample pins/UARTs |
  | NORVI IIOT AE04-I + W5500 Ethernet breakout | ~$141–146 | Yes (onboard) | Yes (onboard) | No (add small W5500 breakout) | Low — one small add-on, industrial DIN-rail base |
  | Arduino Opta RS485 | ~$160–213 | No (USB stick only) | Yes | Yes | Lowest — single integrated unit |
  | ICP DAS WISE-5231 (COTS industrial datalogger, found for comparison) | ~$1,799 | Yes (onboard) | Yes | Yes | Lowest, but wildly over budget |
  | Datexel DAT9000DL (COTS industrial datalogger, found for comparison) | ~$400 | Yes (onboard) | Yes | Yes | Lowest, but cost is overkill for this project |

- **Conclusion: Opta remains the pick.** None of the researched alternatives are a strictly better single-box solution at lower cost — the closest (NORVI IIOT + W5500 breakout, ~$141–146) is cheaper but still requires adding one more board, same as the Mega/Uno shield-stack approach it was meant to improve on, just on a more industrial base. Opta's premium (~$20–70 over the Norvi route) buys genuinely zero additional hardware to add — no shield, no breakout, no wiring beyond power and the sensor bus — which is a real simplicity win worth the price difference for this project's "simple, robust" goals. Mega+shields and NORVI IIOT+W5500 remain documented fallbacks if Opta's price becomes a hard blocker.

- **Decision: Arduino Opta RS485, with USB-stick storage instead of SD card.** USB-stick local storage was confirmed acceptable (the underlying need is local, removable, file-based logging — the medium doesn't have to literally be SD). Despite costing more than both the Teensy and Mega+shields routes, Opta was chosen for the combination of built-in RS485/Modbus AND built-in Ethernet (zero adapter boards for either), full custom C++, DIN-rail housing consistent with the other modules, and lowest assembly effort. The Mega+shields stack remains a noted middle-ground fallback if Opta's price becomes a blocker and a literal SD card matters enough to give up the single-integrated-unit simplicity; Teensy 4.1 remains the cheapest fallback if minimizing cost matters most.

## Bill of materials (draft)
*Draft, not final — see per-row notes. Prices are ballpark from search, not confirmed at checkout. Quantities assume 4 temperature channels to start (per "likely 4, up to 8" — adjust probe count if scaling up).*

| # | Part | Qty | Est. unit price | Est. subtotal | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | [ComWinTop CWT-TM-8PT](https://store.comwintop.com/products/8-channels-pt100-pt1000-rs485-modbus-output-temperature-acquisition-module) — 8ch RTD-to-Modbus module | 1 | ~$42.50–$57 | ~$50 | Register map verified only against sibling product (CWT-KWL); not yet confirmed for this exact SKU — see open items |
| 2 | PT1000 waterproof probe, 3-wire, silicone cable, ~6 ft lead | 4 (up to 8) | ~$8–$15 (varies by length/wire count) | ~$32–$60 | **Placeholder — no specific listing chosen yet.** Needs a specific product pick matching exact lead length (~6 ft / ~1.8m) and 3-wire configuration |
| 3 | CANADUINO RS485 Modbus SHT40 (DIN-rail, confirmed SHT40 via PCB photo) | 1 (up to 2) | ~$9.50 | ~$9.50–$19 | Verified — see research notes |
| 4 | [Arduino Opta RS485](https://store.arduino.cc/products/opta-rs485) — compute/logging platform, built-in RS485/Modbus + Ethernet | 1 | ~$160–$213 | ~$185 | **Decided** — see "Compute & logging platform" in research notes. No separate RS485 or Ethernet adapter needed. Local storage via USB memory stick (confirmed acceptable) rather than SD card |
| 5 | USB memory stick (local logging storage) | 1 | ~$8–$15 | ~$10 | Not yet sized/picked — depends on expected logging duration/data volume before rotation or offload |
| 6 | Shielded twisted-pair RS485 cable (e.g. Belden 3106A-class) | ~10–20 ft (depends on layout) | ~$3.58–$4.85/ft | ~$36–$97 | Length depends on actual chamber/controller placement, not yet measured |
| 7 | 120 Ω termination resistors (RS485 bus ends) | 2 | <$1 | <$1 | Trivial part, not yet sourced but inconsequential |
| 8 | DC power supply | 1 | varies | — | **Not yet chosen** — needs to satisfy the Opta's power input plus both Modbus modules (CWT-TM-8PT 8–30VDC, SHT40 module 5–30VDC); check Opta's own power spec and total current draw once confirmed |
| 9 | Ethernet cable (wired, to wherever InfluxDB/DuckDB runs) | 1 | ~$5–$15 | ~$10 | Length depends on physical layout, not yet measured |
| 10 | Enclosure(s) for controller + modules | — | — | — | Noted as DIY/3D-printed per user's stated willingness — no design started; Opta's own DIN-rail housing may cover the controller itself, enclosure need may be mainly for the RTD/RH modules and wiring |

**Rough total (4-channel start, excluding enclosure/cable length specifics):** ballpark **$270–$400**, dominated by the Opta platform choice — notably higher than the earlier Teensy-based estimate, traded for a more integrated, lower-assembly build.

**Not yet addressed / missing from this BOM:**
- Exact PT1000 probe listing (row 2) — needs a specific pick, not just a category
- Arduino/microcontroller model (row 5)
- DC power supply model/rating (row 8)
- RS485 cable actual run length (row 6) — depends on physical layout not yet planned
- Logging/storage hardware (SD card, RTC module, etc.) — requirements mention local file + database logging (Influx/DuckDB), but no logging hardware or host has been chosen yet; this entire piece of the system hasn't been scoped
- Any enclosure design or wiring harness bill (connectors, wire for DC power distribution, etc.)
- Shipping, taxes, and the inevitable "ordered the wrong connector" buffer