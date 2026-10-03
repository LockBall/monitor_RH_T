# monitor_RH_T
- simple affordable robust Relative Humidity & Temperature (RH & T) monitoring
- monitor RH&T outside and inside a thermotron chamber as well as temps of various items inside the chamber

## Table of Contents
- [Current Status](#current-status)
- [Requirements](#requirements)
- [Constraints](#constraints)
- [Comments](#comments)
- [Research Notes](#research-notes)
  - [Protocol Decision and Known EMI Source](#protocol-decision-and-known-emi-source)
  - [Temperature: PT1000 RTD Read via a Single Multi-Channel Modbus RTU Module](#temperature-pt1000-rtd-read-via-a-single-multi-channel-modbus-rtu-module) - CWT-TM-8PT specs, Waveshare/ComWinTop comparison, probe form factor, open items
    - [ComWinTop CWT-TM-8PT: Confirmed Documentation](#comwintop-cwt-tm-8pt-confirmed-documentation) - register map, comm parameters register, terminal description, full spec table, 2-wire/3-wire wiring diagram, all confirmed from the exact-SKU product images
    - [EMI Hardening](#emi-hardening-known-noise-source-chamber-compressor-during-cooling-cycles) - compressor noise mitigation plan (cable, grounding, termination, wiring separation)
  - [Humidity: Modbus RTU/RS485 SHT40-Based Sensor](#humidity-modbus-rturs485-sht40-based-sensor---current-direction) - HIH-4000/DHT22 history, XY-MD04 vs. DIN-rail decision, chip-variant verification
- [Bill of Materials](#bill-of-materials) - current parts list, dev-scope cost, open BOM items
  - [Power Supply Requirements](#power-supply-requirements) - per-device voltage/current specs, not yet consolidated into a purchasing decision
- [Decided](#decided) - settled topics, not expected to be revisited
  - [Compute & Logging Platform: Arduino Opta RS485](#compute--logging-platform-arduino-opta-rs485) - Teensy/Mega/Uno/Norvi/WISE-5231/Datexel comparison, purchase, power spec
    - [Opta Variant Guide](#opta-variant-guide---buy-the-right-sku) - Lite vs. RS485 vs. WiFi SKUs
- [References](#references) - saved datasheets/photos in `docs/` + external links
- [Glossary](#glossary) - all terms/parts encountered, including superseded ones

*Check this TOC and the sections it points to before re-researching something - most specs, decisions, and sourced documents are already captured below.*

## Current Status

**Stage:** research/planning - Opta RS485 purchased, everything else still being sourced.

**Next steps:** pick a specific PT1000 probe listing and USB stick; source RS485/Ethernet cabling; then prototype and empirically test EMI behavior during a compressor cycle.

## Requirements
| Area | Requirement | Details |
| --- | --- | --- |
| Usability | Simple |  |
| Cost | Affordable |  |
| Reliability | Robust |  |
| operation | Automatic | Run when powered on |
| Reader system | programmable hardware | |
| Logging | Local file | Built-in logging to a file |
| Logging | Database support | database Support, e.g. Influx or Duck |
| Inputs | RH channels | 0 - 2 |
| Inputs | Temp channels | 0 - 8 |
| Temp | Accuracy | Target: ±0.5 °C across the operating range; stretch goal: ±0.1 °C |
| Display | 0.1 °C |  |
| Temp | Probe lead length | ~ 6 ft |
| Temp (°C) | Operating range | ~ -20 to +65  |
| Temp | Probe mounting | Contact sensor metal taped to target surface |

the open air measurment of RH&T could be a single probe unit

note: some of this is open to adjustment

## Constraints
- No I2C - avoid sensors/ADCs that require an I2C bus (e.g. ADS1115, MAX31865, SHT3x/SHT4x, BME280, TMP117).
- No IR / non-contact sensing - all temp sensing must be contact (per probe mounting requirement above).

## Comments
- Current system uses a Type K thermocouple with a yellow two-pin mini connector and brown wire.
- Suspected current accuracy: ±1 - 3 °C.

## Research Notes

### Protocol Decision and Known EMI Source
- A protocol is acceptable if it earns its complexity: evaluated going fully analog/no-protocol (ruling out DS18B20/1-Wire and MAX31865/SPI), but settled on **Modbus RTU over RS485** for the temperature module - it buys noise resilience (CRC-checked messages, differential signaling) and wiring simplicity (one bus serves all channels) in exchange for a protocol that's simple to implement on Arduino (`ModbusMaster` library, no bit-banged timing).
- Known EMI source: the thermotron chamber's **compressor generates electrical noise during cooling cycles** - this is a real, known condition the design must tolerate, not a theoretical risk.

### Temperature: PT1000 RTD Read via a Single Multi-Channel Modbus RTU Module
- **RTD over thermistor/thermocouple:** linear and accurate enough to hit ±0.5 °C without per-unit calibration curves (unlike thermistors) or cold-junction compensation (unlike thermocouples, which is what's currently in use at ±1 - 3 °C).
- **PT1000 over PT100:** 10x more resistance change per °C (3.85 vs. 0.385 Ω/°C) makes it much less sensitive to lead-wire resistance error and noise - important given ~6 ft leads and known compressor EMI. A 1 Ω lead error costs ~0.26 °C on PT1000 vs. ~2.6 °C on PT100.
- **Candidate module: [ComWinTop CWT-TM-8PT](https://store.comwintop.com/products/8-channels-pt100-pt1000-rs485-modbus-output-temperature-acquisition-module)** - 8ch, PT100/PT1000 selectable, RS485/Modbus RTU, 2- or 3-wire RTD input, range -180 to +650 °C, accuracy ±0.25 °C, 8 - 30VDC, DIN-rail, ~$42.50 - $57. One box covers the full 4 - 8 channel range; reads directly over the Opta's built-in RS485 port, no host PC or drivers.
- **Waveshare checked as an alternative - doesn't make an equivalent product.** Waveshare's RS485/Modbus RTU lineup covers relay modules and a generic 8-channel analog-input (voltage/current) acquisition module, not an RTD-specific module with built-in linearization. Pairing their generic analog-input module with separate per-channel RTD-to-analog converters would reintroduce the "one small board per channel" approach already moved away from, so the ComWinTop (or equivalent dedicated RTD) module remains the better fit.
- **Probe form factor:** pre-wired waterproof PT1000 probes (stainless tip + silicone/PTFE cable) - no bare RTD element soldering.
- **Open items:** once hardware is in hand, empirically validate comms/reading stability during an actual compressor cooling cycle vs. idle, and do a final physical continuity check of the terminal pinout against the label before wiring (standard practice, not because any discrepancy is expected now).

#### ComWinTop CWT-TM-8PT: Confirmed Documentation
The comwintop store page itself is blocked (persistent 429 rate-limiting on every fetch attempt), but the user saved the full webpage locally, which included several documentation images embedded in the listing as `.avif` files (not visible via normal page-text fetching - these had to be located in the saved page's asset folder and converted to a readable format). This fully confirms, for the exact purchased SKU, everything the CWT-KWL sibling manual could previously only approximate:
- **Modbus register map ([docs/CWT-TM-8PT_register_map.png](docs/CWT-TM-8PT_register_map.png)):**

  | Address (hex) | Channel | Format | Bytes | Property |
  |---|---|---|---|---|
  | 30H - 3EH (even addresses, 2 per channel) | Channel 1 - 8 | Float | 4 | R |
  | 68H - 6FH (sequential) | Channel 1 - 8 | UINT, scale 0.1 | 2 | R |

  Each channel is available in two forms: a 4-byte float at 30H + 2*(n-1) for channel n, or a 2-byte scaled UINT (raw value / 10 = reading) at 68H + (n-1) for channel n. Both are read-only.
- **Communication parameters register ([docs/CWT-TM-8PT_comm_parameters_register.png](docs/CWT-TM-8PT_comm_parameters_register.png)), address 10H, RW:**
  - Low byte - communication parameters, initial value 00: bits <7:5> reserved; bits <4:3> parity (00=none, 01=even, 10=odd, 11=odd); bits <2:0> baud rate (000=9600, 001=1200, 010=2400, 011=4800, 100=9600, 101=14400, 110=19200).
  - High byte - slave address, initial value 01, valid range 1 - 250.
- **Terminal description table ([docs/CWT-TM-8PT_terminal_description_table.png](docs/CWT-TM-8PT_terminal_description_table.png)):** +V/GND = power; RTDx+/RTDx- = PT100/PT1000 signal pair; GND = PT100/PT1000 GND (3-wire reference); A (D+) / B (D-) = RS485 pair.
- **High-resolution label photo ([docs/CWT-TM-8PT_label_pt1000_variant_hires.png](docs/CWT-TM-8PT_label_pt1000_variant_hires.png))** confirms, pin-for-pin, the terminal pinout already transcribed from the lower-resolution saved label photo:
  - Top 16-pin row: 1=RTD1+, 2=RTD1-, 3=GND, 4=RTD2+, 5=RTD2-, 6=RTD3+, 7=RTD3-, 8=GND, 9=RTD4+, 10=RTD4-, 11=RTD5+, 12=RTD5-, 13=GND, 14=RTD6+, 15=RTD6-, 16=GND
  - Bottom 18-pin row: 1=GND, 2=GND, 3=RTD8+, 4=RTD8-, 5=RTD7+, 6=RTD7-, 7-13=unused/blank, 14=V+, 15=V-, 16=B-, 17=A+
  - Also confirms label text: Model "CWT-TM-8PT", Input type "8 channels PT1000", Power "8V-30V", Output "RS485 (Modbus RTU)".
- **Full spec table ([docs/CWT-TM-8PT_full_spec_table.png](docs/CWT-TM-8PT_full_spec_table.png)):** power supply DC 8 - 30V; power consumption 9mA@30V, 12mA@24V, 23mA@12V, 33mA@8V; input PT100 or PT1000, measure range -180 to +650 degC, resolution 0.1 degC, accuracy 0.25 degC, supports 2-wire and 3-wire connections, supports disconnection and short-circuit detection; output RS485 (Modbus RTU protocol), isolation design; working environment -30 to +55 degC / 0 - 95% RH; ABS material; 35mm DIN-rail mount; dimensions 88 x 72 x 59mm.
- **2-wire vs. 3-wire wiring diagram ([docs/CWT-TM-8PT_wiring_2wire_3wire.png](docs/CWT-TM-8PT_wiring_2wire_3wire.png)):** 3-wire connects RTD(n)+, a shared PGND, and RTD(n)- as three separate leads to the probe. 2-wire connects the same way but requires shorting RTD(n)- to PGND at the terminal block. This settles the 2-wire vs. 3-wire open item in favor of **3-wire** (per the EMI hardening plan's existing lead-resistance-cancellation preference) - no extra hardware needed, just don't short RTD(n)- to GND at the terminal.
- [docs/CWT-KWL_series_PT100_module_manual.pdf](docs/CWT-KWL_series_PT100_module_manual.pdf) (sibling-product manual) is now superseded as the primary register-map source by the exact-SKU confirmation above, but is kept for its worked Modbus transaction examples and the -5000 (0xEC78) disconnected-sensor sentinel value, which the exact-SKU images don't cover.

#### Alternatives Researched for Better Documentation (CWT-TM-8PT Remains Current Pick - Not Yet Decided)
CWT-TM-8PT's documentation is only a sibling-product proxy (see above), not an exact-SKU datasheet - searched for better-documented alternatives. Two real options found, both with a disqualifying tradeoff against the EMI hardening plan's 3-wire preference:
- **Datexel DAT3019 / DAT10019** (Italian manufacturer, real PDF datasheets + user guides hosted directly on [datexel.com](https://www.datexel.com)) - 8ch, PT100/PT1000/Ni100/Ni1000, 10-30VDC, ~$317-344. **2-wire only** - "due to channel design and terminal layout" per their own FAQ. Also far pricier than CWT-TM-8PT.
- **LucidControl Lucid485 RI4/RI8** (German manufacturer deciphe it GmbH, excellent full PDF manual with complete Modbus register map, order codes per sensor type/range) - 4 or 8ch, PT100 or PT1000 (ordered as separate SKUs, not switchable), ~€93-127, built-in bus termination. **2-wire only** ("RTD Two wire measurement" per its own spec table) and USB-powered with RS485 via a separate serial adapter, not a standalone DIN-rail unit the way CWT-TM-8PT is.
- **eletechsup PTDNC04** (Chinese manufacturer with its own branded site, real product pages, plus an independent community-maintained GitHub repo archiving its manual and exact Modbus register map) - **PT1000 + 2-wire or 3-wire supported**, ~$17/unit, but only **4 channels** (would need 2 units for 8ch coverage, ~$34 total - still cheaper than one CWT-TM-8PT). Best match so far on both documentation and wiring requirements; channel count is the only compromise.
- **ICP DAS M-7015/M-7015P** (Taiwanese manufacturer, official datasheet on icpdas.com) - PT1000 supported, M-7015P explicitly offers 3-wire lead-resistance elimination, excellent documentation - but only 6 channels and **$589-709**, 13-16x CWT-TM-8PT's price. Ruled out on cost alone.
- **Still searching** for an 8-channel single-box option that keeps 3-wire + PT1000 + strong exact-model documentation without the ICP DAS price jump.

#### Wiring Layout
Two short RS485 runs back to the Opta's single RS485 port: one into the chamber (CWT-TM-8PT, plus an in-chamber RH module if used), one short run for the open-air RH module. Each device has its own 4-wire terminal (VCC, GND, A, B) - with only 1-2 devices per run this is simple wiring, not a bus topology problem.

#### EMI Hardening (Known Noise Source: Chamber Compressor During Cooling Cycles)
This is a known, real condition - the compressor is expected to generate motor start/run and switching noise during cooling cycles - not a theoretical risk, so it's treated as a hard design input rather than an afterthought.

- **Baseline design already helps:** PT1000's signal strength (see above) resists swamping by induced noise. RS485 is differential - common-mode noise hitting both wires equally is rejected by the receiver. Modbus RTU's CRC check catches a corrupted read so it can be retried instead of silently accepted as a bad value.
- **RS485 bus wiring:**
  - Use **shielded twisted-pair cable** (e.g. Belden 3106A-class or equivalent industrial RS485 cable) for the run between the Opta and the CWT-TM-8PT module - plain unshielded cable is not sufficient this close to compressor noise.
  - **Ground the shield at one end only** (controller end is the usual choice) - grounding both ends creates a ground loop, which *introduces* noise rather than rejecting it.
  - Add **120 Ω termination resistors** across the A/B data lines at both physical ends of the bus to absorb reflections and reduce error rates - relevant here since the controller and the module will typically sit at the two ends of a single cable run.
  - Keep the RS485 cable run physically separated from AC power/compressor wiring where possible (see lead separation below) - don't bundle them in the same conduit or wire loom.
- **RTD probe leads:**
  - Prefer **shielded probe cable** where available - some waterproof PT1000 probes offer a metal braid shield under the outer jacket; this helps reject noise picked up along the ~6 ft lead length.
  - Use **3-wire RTD wiring** into the module rather than 2-wire - beyond the lead-resistance cancellation benefit, the extra wire/connection also reduces susceptibility to noise riding on the lead.
  - **Route/dress RTD leads away from AC power and compressor wiring** - industrial practice suggests at least ~12 inches of separation from AC power conductors; avoid running sensor leads parallel to and bundled with compressor power cabling.
- **Power supply considerations:** the compressor's motor start transients can also couple noise onto shared DC power rails - consider powering the CWT-TM-8PT module and the Opta from a supply with reasonable transient/surge tolerance, and keep sensor-side DC wiring separate from any wiring that shares a circuit with the compressor contactor/motor.
- **Validation, not just theory:** once hardware is built, empirically check behavior during a real compressor cooling cycle vs. idle - log Modbus read failures/retries and apparent temperature noise/spikes during cycling. EMI coupling is highly installation-specific (cable routing, enclosure grounding, chamber construction), so the mitigations above are a starting point to test against, not a guarantee.

### Humidity: Modbus RTU/RS485 SHT40-Based Sensor - Current Direction
- HIH-4000 (the obvious analog alternative) is **discontinued** (Honeywell EOL, last orders May 2025, no analog successor - replacement part is I2C). [Honeywell notice](https://sps-support.honeywell.com/s/article/Ob)
- **DHT22/AM2302 - superseded.** Was the earlier pick (single-wire protocol, not I2C, ~±2% RH), but its own manufacturer-recommended replacement part (AM2301B) is I2C-only, and DHT22 is known to drift beyond its stated ±2% RH spec in real-world use, especially at humidity extremes. (DHT22 itself appears to still be in production/stocked by distributors like DigiKey/Mouser/DFRobot - only Adafruit dropped it from their own catalog - so it isn't fully EOL, but the accuracy/drift concern plus the chance to unify onto one interface motivated the switch below.)
- **Non-I2C accuracy ceiling:** ±2% RH is close to the practical floor for analog/non-I2C humidity sensing - tighter specs (e.g. Sensirion's I2C SHT31-D/SHT4x line) generally require I2C.
- **Decision: put RH on the same RS485/Modbus RTU bus as temperature**, rather than mixing in a different single-wire protocol - one interface, one Arduino library (`ModbusMaster`) for both temp and RH.
- **Form factor: probe-style was initially preferred** - easier to mount/position inside the chamber than a DIN-rail box; the open-air unit's form factor matters less, so one probe-style sensor could have covered both.
- **Candidate considered: [XY-MD04](https://www.icstation.com/rs485-temperature-humidity-sensor-transmitter-sht40-metal-waterproof-probe-120c-100rh-modbus-real-time-monitor-p-16403.html)** - metal waterproof probe, built-in SHT40 chip, RS485/Modbus RTU, ±0.3 °C / ±3% RH, -40 to +120 °C / 0 - 100% RH, 5 - 28VDC (compatible with the CWT-TM-8PT's power range), built-in EMC anti-interference (relevant given the known compressor noise), ~$7.69 - $17 depending on source. Still beats DHT22 on temperature accuracy.
  - **Documentation verified: [docs/XY-MD04_GY21250_Datasheet.pdf](docs/XY-MD04_GY21250_Datasheet.pdf).** Confirms all specs above directly from the manufacturer datasheet, plus: full Modbus register map (temperature at input register 30002, humidity at 30003, both Int16/scale 0.1, function codes 0x03/0x04/0x06/0x10), worked example transactions, exact 4-wire terminal colors (red=VCC, black=GND, yellow=RS485-A, white=RS485-B), probe dimensions (55x15x15mm sensing tip, 100cm lead), and simple ASCII "custom control commands" (e.g. plain-text `READ`, `AUTO`, `TC:`/`HC:` calibration offsets) as an alternative to raw Modbus framing if ever useful for debugging. The datasheet's probe photo shows a sintered/mesh metal tip - a vented design, not sealed, consistent with genuine ambient RH sensing.
- **Form factor decision (revised): DIN-rail box over the probe, for accuracy.** RH/T readings here feed **dew point and dew point margin calculations**, and dew point error grows nonlinearly as RH approaches saturation - a flat ±3% vs ±1.8% RH difference translates to a larger dew-point-margin error exactly in the humidity range most relevant to condensation risk. Accuracy was judged worth the mounting tradeoff, superseding the probe-style preference above.
- **Current candidate: [CANADUINO RS485 Modbus SHT40](https://www.universal-solder.ca/product/rs485-modbus-temperature-humidity-sensor-high-accuracy-sht40/) (DIN-rail)** - ±1.8% RH, ±0.2 °C temp, range -40 to +125 °C / 0 - 100% RH, 5 - 30VDC (compatible with the CWT-TM-8PT's 8 - 30VDC), same 9600 baud/8N1 Modbus defaults as the RTD module, DIN-rail mount, ~C$12.90 (~$9.50 USD).
  - **Enclosure venting confirmed via product photos** ([docs/sht40_photo1.webp](docs/sht40_photo1.webp), [2](docs/sht40_photo2.webp), [3](docs/sht40_photo3.webp)): case is louvered edge-to-edge on every face, SHT40 chip sits right behind the vents - genuinely vented, not sealed. (No text source described this; photos were the only way to confirm it.)
  - **Physical unit is labeled "XY-MD02"**, not "CANADUINO" - the CANADUINO/universal-solder listing is a reseller, not the manufacturer.
  - **Chip variant confirmed for this listing, but not guaranteed market-wide.** Generic "XY-MD02" listings ($3.66 - $17) mostly use the older, less accurate SHT20 chip - model name alone doesn't guarantee SHT40. *This* unit is confirmed SHT40 because the opened-case photo shows "SHT40" silkscreened on the PCB itself - stronger proof than retailer copy. Buy this listing as-is; if sourcing a cheaper listing elsewhere later, require a legible chip-silkscreen photo first, not just the spec sheet.
- **XY-MD04 remains a noted fallback** if probe-style convenience ends up outweighing the accuracy gain once hardware is in hand, though the enclosure-venting concern that motivated keeping it as a fallback is now resolved in the DIN-rail box's favor.

## Bill of Materials

Dev scope: 2 temp probes (enough to prove channel addressing), 1 RH module (proves a second device on the bus).

| # | Part | Qty | Cost ($) | Status |
| --- | --- | --- | --- | --- |
| | **Total** | | **149 - 178+** | |
| 1 | [Arduino Opta RS485](https://store.arduino.cc/products/opta-rs485) (SKU AFX00001) | 1 | 80 | Ordered |
| 2 | DC power supply/supplies | - | varies | Not yet chosen - see [power supply requirements](#power-supply-requirements) |
| 3 | USB memory stick (local logging storage) | 1 | 8 - 15 | Not picked |
| 4 | [ComWinTop CWT-TM-8PT](https://store.comwintop.com/products/8-channels-pt100-pt1000-rs485-modbus-output-temperature-acquisition-module) - 8ch RTD-to-Modbus module | 1 | 42 - 57 | Verified - see research notes |
| 5 | PT1000 waterproof probe, 3-wire, silicone cable, ~6 ft lead | 2 | 8 - 15 | Placeholder - no listing picked yet |
| 6 | [CANADUINO RS485 Modbus SHT40](https://www.universal-solder.ca/product/rs485-modbus-temperature-humidity-sensor-high-accuracy-sht40/) (DIN-rail, confirmed SHT40 via PCB photo) | 1 | 10 | Verified - see research notes |
| 7 | Shielded twisted-pair RS485 cable (e.g. Belden 3106A-class) | short bench length | 5 / ft | - |
| 8 | 120 Ω termination resistors | 2 | < 1 | - |

**Not yet addressed / missing from this BOM:**
- Exact PT1000 probe listing (row 5) - needs a specific pick, not just a category
- USB memory stick sizing/pick (row 3)
- Specific power supply product(s) (row 2) - requirements tabulated below, product not yet picked
- RS485 cable actual run length (row 7) - depends on physical layout not yet planned
- Any enclosure design or wiring harness bill (connectors, wire for DC power distribution, etc.)
- Shipping, taxes, and the inevitable "ordered the wrong connector" buffer

---
<br>

### Power Supply Requirements
*Power (W) and Current (mA) columns are computed at 24VDC.*

| Device | VDC | Watts | mA | Source |
| --- | --- | --- | --- | --- |
| **Total**  | 24 | 2.4 | 100 |  |
| Arduino Opta RS485 mini PLC | 12 - 24 (10.2 - 27.6 permissible) | 2.2 | 92 | [datasheet](docs/Opta_AFX00001-02-03_Datasheet.pdf) - exact unit |
| CWT-TM-8PT | 8 - 30 | 0.29 | 12 | [Full spec table](docs/CWT-TM-8PT_full_spec_table.png) - exact SKU, 12mA @ 24V |
| SHT40 modules (x2, per 0 - 2 RH channel requirement) | 5 - 30 | 0.1 | 4.2 | [XY-MD04 datasheet](docs/XY-MD04_GY21250_Datasheet.pdf) - same chip/design family proxy, not the exact unit; size conservatively until measured |
| PT1000 probes (up to 8) | n/a | 0 | 0 | Passive RTD elements, powered/excited by the CWT-TM-8PT itself, already included in its draw above |

---
<br>

## Decided

### Compute & Logging Platform: Arduino Opta RS485
- **Requirement clarified:** "Reader system" (Arduino or COTS) doesn't mean literally Arduino - the real need is (a) poll both Modbus modules over RS485, (b) log locally, (c) push to InfluxDB/DuckDB running elsewhere. **No wireless, no Linux-class OS** - rules out Raspberry Pi/SBCs, requires wired networking if the device pushes data itself.
- **"Push to a DB without Linux" works via plain HTTP POST over wired Ethernet** to wherever the DB server already runs - a bare microcontroller doesn't need to run the database itself, just needs a wired Ethernet MAC/PHY (proven pattern: Arduino/Teensy + Ethernet library posting to InfluxDB's `/api/v2/write`).
- **Candidate 1: [Teensy 4.1](https://www.pjrc.com/store/teensy41.html) + Ethernet adapter.** Has a genuine onboard microSD card slot (true SD storage, matches the requirement exactly) and an onboard Ethernet MAC + PHY chip (DP83825) built into the main board - but the physical RJ45 jack itself is a separate small add-on board (e.g. [SparkFun's Ethernet Adapter for Teensy](https://docs.sparkfun.com/SparkFun_Teensy_Ethernet_Adapter/quickstart/), connected via a short ribbon cable - see photos saved at [docs/teensy_ethernet_assembly.jpg](docs/teensy_ethernet_assembly.jpg) and [docs/teensy_ethernet_ribbon.jpg](docs/teensy_ethernet_ribbon.jpg)). All wired, no wireless involved. Cheap (~$30 - $40 for the Teensy + adapter combined). Still needs a separate MAX485-class RS485 adapter module to talk to the Modbus devices (same as a plain Arduino would).
- **Candidate 2: [Arduino Opta RS485](https://store.arduino.cc/products/opta-rs485).** Industrial "micro PLC" with RS485/Modbus and Ethernet both built in (no adapter boards), non-wireless variant available, DIN-rail housing, regular Arduino C++ (not ladder logic). No SD card slot or exposed SPI on any variant - official logging solution is a USB memory stick instead. Pricier (~$160 - 213) than Teensy.
- **Candidate 3 (middle ground): Arduino Mega 2560 + Ethernet shield (w/ microSD slot) + RS485 shield.** Stacks three boards rather than one integrated unit, but shields plug directly onto the Mega's header (no loose ribbon-cable wiring like the Teensy's Ethernet adapter). Gets a genuine SD card (most common Ethernet shields, e.g. W5100/W5200-based, include an onboard microSD slot) - satisfies the literal SD card requirement without the USB-stick compromise. Rough cost: Mega (~$40 - 50) + Ethernet shield with SD (~$10 - 18) + RS485 shield (~$10 - 38) = **~$75 - 95 total** - meaningfully cheaper than Opta, pricier than bare Teensy, with less rework than hand-wiring separate adapter boards.
- **Candidate 3b: Arduino Uno instead of Mega, same shields.** Uno is cheaper (~$28 vs. Mega's ~$40 - 50, saving ~$15 - 20) and still compatible with the same W5100-class Ethernet+SD shield and RS485 shields. **Real tradeoff, not just a free discount:** Uno has only 14 digital I/O pins vs. the Mega's 54, and a single hardware UART vs. the Mega's four - stacking an Ethernet/SD shield (uses SPI) and an RS485 shield (uses a serial/UART connection) together on an Uno leaves little headroom and has a documented quirk (a physical switch is needed on some RS485 shields to disconnect it during sketch upload, since it can conflict with the same serial line used for programming). Mega's extra UARTs and pins exist largely to avoid exactly this kind of contention when stacking multiple shields. Uno is viable and worth it if the ~$20 matters, but Mega is the safer/simpler stacking choice.
- **Also considered single purpose-built boards instead of Arduino-anything**, since the real requirement (poll Modbus, log to SD, push to a DB over wired Ethernet) doesn't require Arduino specifically.
  - **[ICP DAS WISE-5231](https://www.icpdas.com/en/product/WISE-5231)** - purpose-built, has everything (Modbus RTU+TCP, built-in SD, RTC, no ladder logic needed) but **~$1,799** - ruled out on cost.
  - **Norvi ESP32 DIN-rail controllers - no single stock model has all three (RS485 + built-in SD + built-in wired Ethernet) together** (verified against datasheets): NORVI ENET (AE06) has wired Ethernet + microSD but no RS-485; NORVI IIOT (AE04, ~$136) has RS-485 + microSD but no built-in Ethernet (would need a separate W5500 breakout wired to its SPI pins, not an official Norvi part). The realistic Norvi-based option is **NORVI IIOT AE04-I + W5500 breakout (~$141 - 146 total)** - cheaper than Opta, more industrial than a shield-stacked Arduino, but still requires adding a small board.
- **Price/capability comparison across all options:**

  | Option | Cost ($) | SD card | Built-in RS485 | Built-in Ethernet | Assembly |
  | --- | --- | --- | --- | --- | --- |
  | Teensy 4.1 + Ethernet adapter + MAX485 module | 35 - 45 | Yes (onboard) | No (add MAX485 module) | No (add adapter board, ribbon cable) | Moderate - loose wiring |
  | Uno + Ethernet shield (w/ SD) + RS485 shield | 55 - 75 | Yes (on shield) | No (add RS485 shield) | Yes (on shield) | Low, but tight on pins/UARTs - possible shield conflicts |
  | **Mega + Ethernet shield (w/ SD) + RS485 shield** | **75 - 95** | Yes (on shield) | No (add RS485 shield) | Yes (on shield) | Low - shields stack directly, ample pins/UARTs |
  | NORVI IIOT AE04-I + W5500 Ethernet breakout | 141 - 146 | Yes (onboard) | Yes (onboard) | No (add small W5500 breakout) | Low - one small add-on, industrial DIN-rail base |
  | Arduino Opta RS485 | 160 - 213 | No (USB stick only) | Yes | Yes | Lowest - single integrated unit |
  | ICP DAS WISE-5231 (COTS industrial datalogger, found for comparison) | 1,799 | Yes (onboard) | Yes | Yes | Lowest, but wildly over budget |
  | Datexel DAT9000DL (COTS industrial datalogger, found for comparison) | 400 | Yes (onboard) | Yes | Yes | Lowest, but cost is overkill for this project |

- **Decision: Arduino Opta RS485.** None of the alternatives were a strictly better single-box solution at lower cost - the closest (NORVI IIOT + W5500 breakout, ~$141 - 146) still requires adding a board, same problem as the Mega/Uno shield stacks. USB-stick storage confirmed acceptable in place of SD (the real need is local, removable, file-based logging).
- **PURCHASED: used, $80** (SKU AFX00001 confirmed) - well under the ~$160 - 213 new price. Other candidates above are no longer live, kept for reference only.
- **Power spec:** see [Bill of materials](#bill-of-materials) (power supply row). RS-485 port has **no internal termination resistors** - external 120Ω resistors are required, as already planned in the EMI hardening section above.

#### Opta Variant Guide - Buy the Right SKU
Arduino sells **three Opta variants that look similar but differ in connectivity** - buying the wrong one means missing RS485 entirely. Confirmed against Arduino's own datasheet (SKU: AFX00001-AFX00002-AFX00003):

| Variant | SKU | Ethernet | RS-485 | Wi-Fi / Bluetooth | Use case |
| --- | --- | --- | --- | --- | --- |
| **Opta Lite** | AFX00003 | Yes | **No** | No | Only if you don't need Modbus RTU/RS485 at all - **not this project** |
| **Opta RS485** | **AFX00001** | Yes | **Yes** (half-duplex) | No | **This is the correct one for this project** - Modbus RTU over RS485, no wireless |
| **Opta WiFi** | AFX00002 | Yes | Yes (half-duplex) | Yes (WiFi + BLE) | Has RS485 too, but adds wireless radios this project explicitly doesn't want - avoid even though it technically has RS485 |

**Buying checklist:**
- Confirm **SKU AFX00001**, or the listing explicitly says **"Opta RS485"** (not "Lite" or "WiFi") - the physical units look identical from the outside, the model name/SKU is the only reliable way to tell them apart, especially important when buying used/secondhand where the original packaging may not be included.
- All three variants share identical core hardware otherwise (same STM32H747XI dual-core processor, same 8 analog/digital inputs, same 4 relay outputs, same 12 - 24VDC supply) - so a used/secondhand unit's price won't necessarily reflect which variant it is; always verify the model before paying.

## References
Saved local copies (verified primary sources, not just search summaries) live in [docs/](docs/):
- [docs/CWT-KWL_series_PT100_module_manual.pdf](docs/CWT-KWL_series_PT100_module_manual.pdf) - ComWinTop RTD module family manual (register map, wiring diagram)
- [docs/XY-MD04_GY21250_Datasheet.pdf](docs/XY-MD04_GY21250_Datasheet.pdf) - XY-MD04 RH probe datasheet (register map, wiring, specs)
- [docs/SHT40_Datasheet.pdf](docs/SHT40_Datasheet.pdf) - raw Sensirion SHT40 chip datasheet
- [docs/sht40_photo1.webp](docs/sht40_photo1.webp), [docs/sht40_photo2.webp](docs/sht40_photo2.webp), [docs/sht40_photo3.webp](docs/sht40_photo3.webp) - CANADUINO/XY-MD02 RH module product photos (enclosure venting + PCB chip confirmation)
- [docs/teensy_ethernet_assembly.jpg](docs/teensy_ethernet_assembly.jpg), [docs/teensy_ethernet_ribbon.jpg](docs/teensy_ethernet_ribbon.jpg) - Teensy 4.1 + SparkFun Ethernet Adapter assembly photos
- [docs/Opta_AFX00001-02-03_Datasheet.pdf](docs/Opta_AFX00001-02-03_Datasheet.pdf) - official Arduino Opta collective datasheet (all 3 variants, power spec, wiring, Modbus RTU notes)

Key external links referenced throughout:
- [ComWinTop CWT-TM-8PT product page](https://store.comwintop.com/products/8-channels-pt100-pt1000-rs485-modbus-output-temperature-acquisition-module)
- [XY-MD04 product page](https://www.icstation.com/rs485-temperature-humidity-sensor-transmitter-sht40-metal-waterproof-probe-120c-100rh-modbus-real-time-monitor-p-16403.html)
- [CANADUINO RS485 Modbus SHT40 product page](https://www.universal-solder.ca/product/rs485-modbus-temperature-humidity-sensor-high-accuracy-sht40/)
- [Honeywell HIH-4000 obsolescence notice](https://sps-support.honeywell.com/s/article/Ob)
- [Arduino Opta RS485 product page](https://store.arduino.cc/products/opta-rs485)
- [Teensy 4.1 product page](https://www.pjrc.com/store/teensy41.html)
- [SparkFun Teensy Ethernet Adapter quickstart](https://docs.sparkfun.com/SparkFun_Teensy_Ethernet_Adapter/quickstart/)
- [ICP DAS WISE-5231 product page](https://www.icpdas.com/en/product/WISE-5231)

## Glossary
| Term | Meaning |
| --- | --- |
| 1-Wire | A digital communication protocol (Dallas/Maxim) that lets multiple sensors share a single data wire (plus ground/power), each addressed by a unique factory-burned ID - simplifies multi-channel wiring vs. one-ADC-channel-per-sensor approaches. Considered for temp sensing (via DS18B20) then ruled out in favor of an analog/no-bus approach, before the project settled on Modbus RTU as an acceptable protocol - see research notes |
| Accuracy | How close a measured value is to the true value (vs. resolution, which is just how finely it's displayed) |
| ADC | Analog-to-Digital Converter - converts an analog voltage/resistance signal into a digital value a microcontroller can read |
| ADS1115 | A common external 16-bit I2C ADC module, often used to read sensors with more resolution than a microcontroller's built-in ADC |
| AM2301B | Manufacturer-recommended replacement part for the DHT22/AM2302 - but it's I2C-only, which is why DHT22 wasn't simply swapped for it |
| BME280 | A common I2C sensor measuring temperature, humidity, and pressure |
| Cold-junction compensation (CJC) | Correction applied to thermocouple readings to account for the temperature at the measurement device's terminals (the "cold junction"), required for accurate thermocouple readings |
| Common-mode noise | Electrical noise that affects both conductors of a signal pair equally; differential receivers (like RS485) reject it because they only respond to the voltage *difference* between the two wires |
| COTS | Commercial Off-The-Shelf - a pre-built product bought rather than custom-developed |
| Data logger | A device or system that records sensor readings over time, typically to local storage |
| DHT22 / AM2302 | A combined temperature + humidity sensor using a single-wire proprietary digital protocol (not I2C, not Dallas 1-Wire compatible - one sensor per data pin); ~±0.5 °C temp accuracy, ~±2% RH accuracy (known to drift beyond this in practice), 0.1 resolution on both, low cost (~$5 - 10). Earlier choice for RH, superseded by a Modbus RTU/RS485 SHT40-based sensor - see research notes |
| Display resolution | The smallest increment a reading can be shown in (e.g. 0.1 °C), distinct from accuracy |
| DS18B20 | A common 1-Wire digital temperature sensor: ~±0.5 °C accuracy, up to 12-bit (0.0625 °C) resolution, -55 to +125 °C range, low cost (~$1 - 2 each); multiple units can share one GPIO pin/bus, no I2C required. Sold as a bare TO-92 chip or as pre-wired waterproof stainless-steel probes (the latter preferred to avoid raw-chip soldering). Earlier candidate, superseded by the PT1000 + Modbus RTU direction once protocols were reconsidered |
| DuckDB | An embedded, file-based analytical database (no server required), suitable for simple local logging |
| Ground loop | Unwanted current flowing through a cable's shield/ground conductor, caused by a small voltage difference between two separate earth-ground connection points. Happens when a shield is grounded at *both* ends of a cable run - each end sits at a slightly different ground potential, and that difference drives a current through the shield, which radiates as noise instead of being absorbed by it. Fix: ground the shield at **one end only** (see EMI hardening above) so there's no second ground reference to create the loop |
| HIH-4000 series | A Honeywell analog-output RH sensor (no digital bus - just a voltage read via ADC); accuracy ~±3.5% RH best-fit, ±2% RH typical at 50% RH. Was the leading no-protocol RH candidate, but discontinued (Honeywell EOL, last orders May 2025) with no analog successor - see research notes |
| I2C | Inter-Integrated Circuit - a common 2-wire digital communication protocol used by many sensors (e.g. SHT3x, BME280) |
| InfluxDB | A time-series database optimized for storing and querying timestamped sensor/metrics data |
| IR thermopile (e.g. MLX90614) | A non-contact infrared temperature sensor - ruled out since probe mounting must be contact-based |
| MAX31865 | A dedicated RTD-to-digital converter chip/board, commonly used one-per-channel to read PT100/PT1000 RTDs accurately |
| Modbus RTU | A simple, widely-used serial (UART) request/response protocol with CRC error-checking, commonly run over RS485; much lower complexity than a shared-bus timing scheme like 1-Wire - read as request a register, parse the response |
| NORVI | A line of ESP32-based industrial DIN-rail controllers (IIOT, ENET, X, GSM series) with varying combinations of RS-485, Ethernet, microSD, and RTC built in - researched as an Opta alternative; no single stock model had all three of RS-485+SD+Ethernet together |
| NTC | Negative Temperature Coefficient (thermistor) - resistance decreases as temperature increases; cheap, sensitive, but non-linear and needs per-unit calibration |
| Operating range | The range of temperatures/conditions over which a sensor or device is rated to perform accurately |
| Opta (Lite / RS485 / WiFi) | Arduino's industrial "micro PLC" product line (STM32H747XI-based), sold in three variants differing only in connectivity (see Opta variant guide in research notes) - the RS485 variant (SKU AFX00001) was purchased as this project's compute/logging platform |
| Parasite power (1-Wire) | A wiring mode where a 1-Wire device draws power from the data line itself (2-wire: data + ground, no separate power wire); simplifies wiring but is less reliable over long cable runs or with many devices - a separate 3rd power wire is more robust |
| Probe lead | The wire connecting a sensor probe to the measurement/logging device |
| PT100 / PT1000 | Platinum RTD types with 100 Ω / 1000 Ω resistance at 0 °C |
| PTC | Positive Temperature Coefficient - resistance increases as temperature increases (less common for precision sensing than NTC) |
| Pull-up resistor | A resistor connecting a digital data line to the supply voltage so the line reads a defined "high" state when idle; 1-Wire buses require one, and its value affects max cable length/device count |
| RH | Relative Humidity |
| RS485 | A differential serial electrical standard (twisted-pair, 2-wire A/B) used to carry protocols like Modbus RTU over long cable runs with strong noise rejection (common-mode noise on the pair is rejected by the receiver) |
| RTD | Resistance Temperature Detector - a sensor (often platinum, e.g. PT100/PT1000) whose electrical resistance changes predictably with temperature; linear, stable, good accuracy |
| SHT3x / SHT4x | Sensirion I2C humidity & temperature sensor families, commonly used for RH measurement |
| SHT40 | A Sensirion-made, current-generation digital humidity/temperature sensor chip; higher real-world accuracy than DHT22 (~±1.8% RH, ±0.2 °C typical); available natively as I2C, but also sold pre-integrated on RS485/Modbus RTU carrier boards - the latter is the current RH candidate for this project |
| T | Temperature |
| Termination resistor | A resistor (typically 120 Ω for RS485) placed across the A/B data pair at each of the two physical ends of the bus. RS485 is a transmission line - without termination, signal reflections bounce back off the open cable ends and corrupt data, especially over longer runs or higher baud rates. The resistor matches the cable's characteristic impedance so the signal is absorbed instead of reflected. The Opta has no internal termination resistors (per its datasheet), so external ones must be added if the bus needs them - see [BOM](#bill-of-materials) row 8 |
| Thermistor | A resistor whose resistance varies strongly with temperature (NTC or PTC type); used for temperature sensing |
| Thermocouple | A sensor made of two dissimilar metal wires joined at one end, producing a voltage related to temperature difference; wide range and rugged, but lower accuracy without compensation |
| Thermotron chamber | An environmental test chamber (brand name genericized) used to subject items to controlled temperature/humidity conditions |
| TMP117 | A high-precision (±0.1 °C) I2C digital temperature sensor - ruled out due to the no-I2C constraint |
| Type K | A common thermocouple type (Chromel/Alumel), wide range (~ -200 to +1260 °C), moderate accuracy (~±1 - 2 °C typical) |
| W5500 | A hardwired TCP/IP Ethernet controller chip commonly used to add wired Ethernet to microcontrollers (e.g. ESP32, Teensy) via SPI - used in the Norvi IIOT+Ethernet-breakout option considered for the compute platform |
