export const generateMagicLinkTemplate = (restaurantName: string, magicUrl: string = "{{ .ConfirmationURL }}") => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { background-color: #08090A; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .wrapper { background-color: #08090A; width: 100%; padding: 40px 0; }
    .container { max-width: 500px; margin: 0 auto; padding: 0 20px; }
    .card { background-color: #121417; border: 1px solid #222222; border-radius: 24px; padding: 48px 32px; text-align: center; }
    .logo-text { color: #E0E0E0; font-size: 20px; font-weight: 300; letter-spacing: 2px; margin-bottom: 32px; text-transform: uppercase; }
    .title { color: #FFFFFF; font-size: 26px; font-weight: 500; margin-bottom: 12px; letter-spacing: -0.02em; }
    .subtitle { color: #8A8F98; font-size: 15px; line-height: 1.6; margin-bottom: 32px; font-weight: 300; }
    .button-container { margin: 32px 0; }
    .button { background-color: #5E6AD2; border-radius: 12px; color: #FFFFFF !important; display: inline-block; font-size: 15px; font-weight: 500; padding: 16px 32px; text-decoration: none; }
    .divider { border-top: 1px solid #222222; margin: 32px 0; }
    .footer-text { color: #444444; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 24px; }
    .link-alt { color: #5E6AD2; font-size: 12px; word-break: break-all; margin-top: 16px; text-decoration: none; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="card">
        <div class="logo-text">Cafe Kothay</div>
        <h1 class="title">Magic Link</h1>
        <p class="subtitle">Click the button below to securely sign in to <strong>${restaurantName}</strong>. This link will expire shortly for your security.</p>
        <div class="button-container">
          <a href="${magicUrl}" class="button">Confirm Login</a>
        </div>
        <div class="divider"></div>
        <p class="subtitle" style="font-size: 12px; margin-bottom: 8px;">Trouble with the button? Copy this URL:</p>
        <a href="${magicUrl}" class="link-alt">${magicUrl}</a>
        <div class="footer-text">Sent via Cafe Kothay</div>
      </div>
    </div>
  </div>
</body>
</html>`;
};