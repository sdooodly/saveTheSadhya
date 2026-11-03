"""End-to-end QA for the built site. Never touches the real Google Sheet: every
request to script.google.com is intercepted and answered locally."""
import json, sys, urllib.parse
from playwright.sync_api import sync_playwright

import os
BASE = os.environ.get("BASE_URL", "http://localhost:8790/saveTheSadhya/")
SITE = "https://sdooodly.github.io/saveTheSadhya/"
IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
ANDROID = "Mozilla/5.0 (Linux; Android 14; Nothing Phone (2)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"

results = []
def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail and not ok else ""))

def new_page(b, *, mobile=True, ua=ANDROID, tz="Asia/Kolkata", reduced=False, sheet="ok"):
    ctx = b.new_context(
        viewport={"width": 412, "height": 915} if mobile else {"width": 1280, "height": 800},
        device_scale_factor=2.6 if mobile else 1, is_mobile=mobile, has_touch=mobile,
        user_agent=ua if mobile else None, timezone_id=tz,
        reduced_motion="reduce" if reduced else "no-preference",
    )
    pg = ctx.new_page()
    pg.errors, pg.bad, pg.posts = [], [], []
    pg.on("pageerror", lambda e: pg.errors.append(str(e)))
    pg.on("console", lambda m: pg.errors.append(m.text) if m.type == "error" else None)
    pg.on("response", lambda r: pg.bad.append(f"{r.status} {r.url}") if r.status >= 400 and "localhost" in r.url else None)
    def sheet_handler(route):
        pg.posts.append(route.request.post_data)
        if sheet == "offline": route.abort("internetdisconnected")
        else: route.fulfill(status=200, body='{"result":"success"}')
    pg.route("**/script.google.com/**", sheet_handler)
    pg.route("**/*google.com/maps/**", lambda r: r.abort())
    return ctx, pg

def open_invite(pg):
    pg.goto(BASE); pg.wait_for_timeout(2600)
    pg.get_by_role("button", name="Enter invitation").click()
    pg.wait_for_timeout(3600)

def no_overflow(pg):
    return pg.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")

with sync_playwright() as p:
    b = p.chromium.launch(args=["--autoplay-policy=user-gesture-required"])

    # 1. Opening screen
    ctx, pg = new_page(b)
    pg.goto(BASE); pg.wait_for_timeout(3000)
    imgs = pg.evaluate("[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)")
    check("intro: every image loads", not imgs, imgs)
    check("intro: no horizontal scroll", no_overflow(pg))
    check("intro: names and phrases present", all(t in pg.inner_text("body") for t in ["Together with their families", "Gayathri", "Anand", "Invite you to their wedding", "Open invitation"]))
    check("intro: no external-link arrow", "↗" not in pg.inner_text("body"))
    audio_src = pg.evaluate("document.getElementById('bg-music')?.getAttribute('preload')")
    check("music does not download before opening", audio_src == "none", audio_src)

    # 2. Envelope + music
    pg.get_by_role("button", name="Enter invitation").click()
    pg.wait_for_timeout(500)
    check("music starts on the tap", pg.evaluate("!document.getElementById('bg-music').paused"))
    pg.wait_for_timeout(3500)
    btn = pg.get_by_role("button", name="Pause music")
    check("music button shows 'Pause'", btn.count() == 1)
    btn.click(); pg.wait_for_timeout(300)
    check("music pauses", pg.evaluate("document.getElementById('bg-music').paused") and pg.get_by_role("button", name="Play music").count() == 1)
    pg.get_by_role("button", name="Play music").click(); pg.wait_for_timeout(300)
    check("music resumes", not pg.evaluate("document.getElementById('bg-music').paused"))

    # 3. Main page content
    body = pg.inner_text("#invitation")
    check("main: names lead (no welcome lines)", "Request the pleasure" not in body and "Gayathri" in body)
    check("main: date", "Sunday, 31 January 2027" in body)
    check("main: muhurtham", "Muhurtham: 12:12 p.m. to 12:33 p.m." in body)
    check("main: venue + city", "RDR Auditorium" in body and "Thiruvananthapuram" in body)
    check("main: no 'View map', no dress code", "View map" not in body and "Dress code" not in pg.inner_text("body"))
    check("main: fits one screen", pg.evaluate("(()=>{const s=document.querySelector('#invitation > div');return s.scrollHeight<=s.clientHeight})()"))
    check("main: no horizontal scroll", no_overflow(pg))
    venue = pg.get_by_role("link").filter(has_text="RDR Auditorium")
    href = venue.get_attribute("href"); target = venue.get_attribute("target")
    check("venue opens Google Maps in a new tab", href.startswith("https://www.google.com/maps/") and "RDR+Auditorium" in href and target == "_blank", href)

    cal = pg.get_by_role("link").filter(has_text="Add to calendar")
    q = urllib.parse.parse_qs(urllib.parse.urlparse(cal.get_attribute("href")).query)
    check("calendar: Google template link", cal.get_attribute("href").startswith("https://calendar.google.com/calendar/render?"))
    check("calendar: muhurtham in UTC", q["dates"][0] == "20270131T064200Z/20270131T070300Z", q.get("dates"))
    check("calendar: links to the invitation, not the profile", SITE in q["details"][0] and "savethesadhya.com" not in q["details"][0], q["details"][0])
    check("calendar: precise location", q["location"][0].startswith("RDR Auditorium, Edapazhanji, Thiruvananthapuram"), q["location"][0])
    check("main: no console errors (incl. hydration)", not pg.errors, pg.errors[:3])
    check("main: no missing files", not pg.bad, pg.bad[:5])

    # 4. Scroll to RSVP via the chevron
    pg.get_by_role("button", name="Scroll to RSVP section").click(force=True); pg.wait_for_timeout(1500)
    check("chevron scrolls to RSVP", pg.evaluate("document.getElementById('rsvp').getBoundingClientRect().top") < 50)
    check("rsvp: deadline shown", "Kindly respond by 1 January 2027" in pg.inner_text("#rsvp"))
    send = pg.get_by_role("button", name="Send RSVP")
    check("rsvp: Send disabled until an answer is chosen", send.is_disabled())

    # 5. Validation: spaces-only name
    pg.get_by_placeholder("Full name").fill("    ")
    pg.get_by_role("button", name="Joyfully accept").click()
    send.click(); pg.wait_for_timeout(300)
    check("rsvp: spaces-only name is rejected with a message", pg.locator("#rsvp [role=alert]").count() == 1 and "name" in pg.locator("#rsvp [role=alert]").inner_text().lower())
    check("rsvp: nothing sent for invalid form", not pg.posts)

    # 6. Guests: max 3, names, then switch to decline
    pg.get_by_placeholder("Full name").fill("  Priya   Menon ")
    check("rsvp: error clears when typing", pg.locator("#rsvp [role=alert]").count() == 0)
    add = pg.get_by_role("button", name="Add guest")
    for _ in range(5):
        if add.is_enabled(): add.click()
    check("rsvp: guests capped at 3", pg.locator("input[placeholder^='Guest ']").count() == 3 and add.is_disabled())
    pg.locator("input[placeholder='Guest 1 name']").fill(" Ravi ")
    pg.get_by_role("button", name="Remove guest").click()
    check("rsvp: removing a guest keeps earlier names", pg.locator("input[placeholder='Guest 1 name']").input_value() == " Ravi " and pg.locator("input[placeholder^='Guest ']").count() == 2)
    pg.get_by_role("button", name="Regretfully decline").click(); pg.wait_for_timeout(400)
    pg.get_by_placeholder("Leave a note for us…").fill("So sorry to miss it")
    pg.get_by_role("button", name="Joyfully accept").click(); pg.wait_for_timeout(400)

    # 7. Submit (accept) — payload + thank-you
    send.click(); pg.wait_for_timeout(2500)
    payload = json.loads(pg.posts[-1]) if pg.posts else {}
    check("rsvp: exactly one request sent", len(pg.posts) == 1, len(pg.posts))
    check("rsvp: payload cleaned", payload == {"name": "Priya Menon", "attending": "yes", "plusOnes": 2, "plusOneNames": ["Ravi", ""], "message": ""}, payload)
    t = pg.inner_text("#rsvp")
    rsvp_hidden = pg.evaluate("(()=>{const h=[...document.querySelectorAll('#rsvp h2')].find(e=>e.textContent.trim()==='RSVP');const c=h.closest('.sr-only');if(!c)return false;const r=c.getBoundingClientRect();return r.width<=1&&r.height<=1})()")
    pass
    check("thank-you: first name, single visible heading", "Thank you, Priya" in t and rsvp_hidden and "Kindly respond" not in t, t[:120])
    check("thank-you: leaves fall", pg.locator("img[src*='/leaves/monstera-']").count() > 0)
    check("thank-you: no console errors", not pg.errors, pg.errors[:3])
    ctx.close()

    # 8. Decline path payload
    ctx, pg = new_page(b)
    open_invite(pg); pg.evaluate("document.getElementById('rsvp').scrollIntoView()"); pg.wait_for_timeout(1200)
    pg.get_by_placeholder("Full name").fill("Arun")
    pg.get_by_role("button", name="Joyfully accept").click(); pg.get_by_role("button", name="Add guest").click()
    pg.get_by_role("button", name="Regretfully decline").click(); pg.wait_for_timeout(400)
    pg.get_by_placeholder("Leave a note for us…").fill("Congratulations!")
    pg.get_by_role("button", name="Send RSVP").click(); pg.wait_for_timeout(2000)
    payload = json.loads(pg.posts[-1]) if pg.posts else {}
    check("decline: guests dropped, note kept", payload == {"name": "Arun", "attending": "no", "plusOnes": 0, "plusOneNames": [], "message": "Congratulations!"}, payload)
    check("decline: kind message, no leaves", "We’ll miss you." in pg.inner_text("#rsvp") and pg.locator("img[src*='/leaves/monstera-']").count() == 0)
    ctx.close()

    # 9. Offline: must NOT pretend it worked
    ctx, pg = new_page(b, sheet="offline")
    open_invite(pg); pg.evaluate("document.getElementById('rsvp').scrollIntoView()"); pg.wait_for_timeout(1200)
    pg.get_by_placeholder("Full name").fill("Offline Guest"); pg.get_by_role("button", name="Joyfully accept").click()
    pg.get_by_role("button", name="Send RSVP").click(); pg.wait_for_timeout(2000)
    check("offline: shows an error and keeps the form", pg.locator("#rsvp [role=alert]").count() == 1 and pg.get_by_placeholder("Full name").input_value() == "Offline Guest" and "Thank you" not in pg.inner_text("#rsvp"))
    check("offline: can retry", pg.get_by_role("button", name="Send RSVP").is_enabled())
    ctx.close()

    # 10. Time zones
    for tz in ["America/Los_Angeles", "Pacific/Honolulu", "Europe/London", "Asia/Dubai", "Australia/Sydney"]:
        ctx, pg = new_page(b, tz=tz); open_invite(pg)
        ok = "Sunday, 31 January 2027" in pg.inner_text("#invitation") and "1 January 2027" in pg.inner_text("#rsvp")
        check(f"dates correct in {tz}", ok); ctx.close()

    # 11. iPhone → .ics, Android → Google
    ctx, pg = new_page(b, ua=IPHONE); open_invite(pg)
    with pg.expect_request("**/wedding.ics") as req:
        pg.get_by_role("link").filter(has_text="Add to calendar").click()
    check("iPhone: calendar opens the .ics file", req.value.url.endswith("/saveTheSadhya/wedding.ics"), req.value.url)
    ctx.close()
    ctx, pg = new_page(b, ua=ANDROID); open_invite(pg)
    with ctx.expect_event("request", lambda r: "calendar.google.com" in r.url) as req, ctx.expect_page():
        pg.get_by_role("link").filter(has_text="Add to calendar").click()
    check("Android: calendar opens Google Calendar in a new tab", req.value.url.startswith("https://calendar.google.com/calendar/render?"), req.value.url)
    ctx.close()

    # 12. Static files
    ctx, pg = new_page(b, mobile=False)
    r = pg.request.get(BASE + "wedding.ics")
    ics = r.text()
    check(".ics served, valid and complete", r.status == 200 and ics.startswith("BEGIN:VCALENDAR\r\n") and "DTSTART:20270131T064200Z" in ics and "END:VCALENDAR" in ics)
    for path in ["og-invite.jpg", "ganesha.png", "monstera-leaf.png", "monstera-vine.webp", "mint-wash.webp", "leaves/corner-pair.webp", "AlexTurner.mp3", "gaya-child.png", "anand-child.png", ".nojekyll", "404.html"]:
        check(f"file exists: {path}", pg.request.get(BASE + path).status == 200)
    pg.goto(BASE + "404.html"); pg.wait_for_timeout(800)
    link = pg.get_by_role("link", name="Open the invitation")
    check("404 page offers a way back", link.count() == 1 and link.get_attribute("href") in ("/saveTheSadhya/", "/saveTheSadhya"), link.get_attribute("href") if link.count() else None)
    html = pg.request.get(BASE).text()
    check("link preview tags point at the live site", f'content="{SITE}og-invite.jpg"' in html and f'property="og:url" content="{SITE}"' in html)
    ctx.close()

    # 13. Desktop + nav dots
    ctx, pg = new_page(b, mobile=False); open_invite(pg)
    pg.get_by_role("button", name="Go to RSVP").click(); pg.wait_for_timeout(1500)
    check("desktop: nav dot scrolls to RSVP", pg.evaluate("document.getElementById('rsvp').getBoundingClientRect().top") < 50)
    check("desktop: no errors", not pg.errors and not pg.bad, (pg.errors + pg.bad)[:3])
    ctx.close()

    # 14. Reduced motion: no envelope animation, straight in
    ctx, pg = new_page(b, reduced=True)
    pg.goto(BASE); pg.wait_for_timeout(2600); pg.get_by_role("button", name="Enter invitation").click(); pg.wait_for_timeout(1200)
    check("reduced motion: opens straight to the invitation", "Sunday, 31 January 2027" in pg.inner_text("body"))
    ctx.close()

    # 15. Small phone
    ctx = b.new_context(viewport={"width": 360, "height": 640}, device_scale_factor=2, is_mobile=True, has_touch=True)
    pg = ctx.new_page(); pg.goto(BASE); pg.wait_for_timeout(2600)
    check("360px phone: intro no horizontal scroll", no_overflow(pg))
    pg.get_by_role("button", name="Enter invitation").click(); pg.wait_for_timeout(3600)
    check("360px phone: main no horizontal scroll", no_overflow(pg))
    pg.evaluate("document.getElementById('rsvp').scrollIntoView()"); pg.wait_for_timeout(1200)
    pg.get_by_role("button", name="Joyfully accept").click(); pg.wait_for_timeout(300)
    check("360px phone: RSVP buttons fit on one line each", pg.evaluate("[...document.querySelectorAll('#rsvp fieldset button')].every(b=>b.getBoundingClientRect().height<60)"))
    pass
    ctx.close()
    b.close()

fails = [r for r in results if not r[1]]
print(f"\n{len(results) - len(fails)}/{len(results)} checks passed")
sys.exit(1 if fails else 0)
