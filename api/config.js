// Public, non-secret configuration for the inquiry form.
// Server-side secrets are never returned to the browser.
module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({message:'Method not allowed'})}
  const names=['RESEND_API_KEY','INQUIRY_TO_EMAIL','INQUIRY_FROM_EMAIL','TURNSTILE_SECRET_KEY','TURNSTILE_SITE_KEY'];
  const enabled=names.every(name=>Boolean(process.env[name]));
  return res.status(200).json({enabled,siteKey:enabled?process.env.TURNSTILE_SITE_KEY:null});
};