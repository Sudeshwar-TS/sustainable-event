import qrcode
import io
import base64


def generate_event_qr(event_token: str) -> str:
    """
    Generate a base64 PNG QR code that points to
    the wedding RSVP page using the event token.
    """

    url = f"https://sustainable-event.vercel.app/invite/{event_token}"

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=5,
    )

    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")

    return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode()