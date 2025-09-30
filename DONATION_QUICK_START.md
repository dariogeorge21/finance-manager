# Veritas-25 Donation System - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Razorpay
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Copy your **Key ID** and **Key Secret**
5. Update `.env.local`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   ```

### Step 2: Create Veritas25 Project in Database
Run this SQL in your Supabase SQL Editor:
```sql
-- Check if project exists
SELECT * FROM projects WHERE project_name = 'veritas25';

-- If not exists, create it (replace 'your_password' with actual password)
INSERT INTO projects (project_name, password_hash)
VALUES ('veritas25', crypt('your_password', gen_salt('bf')));
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Test the Flow
1. Visit `http://localhost:3000`
2. Click the pink "Donate for Veritas-25" card
3. Read the information page
4. Click "Donate Now"
5. Fill the form and test payment

## 📱 User Journey

```
Homepage (/)
    ↓
    [Click Donation Card]
    ↓
Donation Info (/donate)
    ↓
    [Click "Donate Now"]
    ↓
Donation Form (/donate/form)
    ↓
    [Fill Form & Submit]
    ↓
Razorpay Payment Modal
    ↓
    [Complete Payment]
    ↓
Success Screen
    ↓
    [Auto-redirect after 3s]
    ↓
Homepage (/)
```

## 🧪 Testing with Razorpay Test Mode

### Test Card Numbers
Use these in Razorpay test mode:

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI
- UPI ID: `success@razorpay`

## 📊 Verify Donations in Database

After a successful donation, check your Supabase database:

```sql
SELECT 
    i.name,
    i.phone_number,
    i.amount,
    i.description,
    i.date,
    i.called_by,
    p.project_name
FROM income i
JOIN projects p ON i.project_id = p.id
WHERE i.called_by = 'DONATION'
ORDER BY i.created_at DESC;
```

## 🎨 Customization Options

### Change Donation Card Colors
Edit `app/page.tsx`:
```tsx
// Current: Rose/Pink gradient
className="bg-gradient-to-r from-rose-500 to-pink-600"

// Alternative: Blue gradient
className="bg-gradient-to-r from-blue-500 to-indigo-600"
```

### Modify Suggested Amounts
Edit `app/donate/form/page.tsx`:
```tsx
<p className="text-sm text-gray-500">
  Suggested amounts: ₹100, ₹500, ₹1000, or any amount you wish
</p>
```

### Update Success Message
Edit `app/donate/form/page.tsx`:
```tsx
toast.success('Thank you for donating to Veritas 2025. May God bless you.')
```

## 🔍 Troubleshooting

### Issue: "Razorpay is not defined"
**Solution:** Check that Razorpay script is loading. Open browser console and verify no errors.

### Issue: "Veritas-25 project not found"
**Solution:** Ensure `veritas25` project exists in database (see Step 2).

### Issue: Payment verification failed
**Solution:** 
1. Check `RAZORPAY_KEY_SECRET` in `.env.local`
2. Verify it matches your Razorpay dashboard
3. Restart dev server after changing env variables

### Issue: Donation not appearing in database
**Solution:**
1. Check browser console for errors
2. Verify Supabase service role key is correct
3. Check Supabase logs for insert errors

## 📈 Going Live

### Before Production:
1. ✅ Switch to Razorpay Live Mode keys
2. ✅ Test with real small amount
3. ✅ Verify database inserts work
4. ✅ Test on mobile devices
5. ✅ Set up email notifications (optional)
6. ✅ Add analytics tracking (optional)

### Switch to Live Mode:
1. Get Live API keys from Razorpay
2. Update `.env.local`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   ```
3. Rebuild and deploy:
   ```bash
   npm run build
   npm start
   ```

## 🎯 Key Features Implemented

✅ **Landing Page Card** - Eye-catching donation CTA
✅ **Information Page** - Explains Veritas-25 mission
✅ **Donation Form** - Validated form with Razorpay
✅ **Payment Integration** - Secure Razorpay checkout
✅ **Database Storage** - Donations tracked in income table
✅ **Success Feedback** - Thank you message and redirect
✅ **Error Handling** - Graceful error messages
✅ **Mobile Responsive** - Works on all devices
✅ **Type Safety** - Full TypeScript support

## 📞 Support Resources

- **Razorpay Docs:** https://razorpay.com/docs/
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

## 🎉 Success Indicators

Your donation system is working correctly when:
1. ✅ Donation card appears on homepage
2. ✅ Information page loads without errors
3. ✅ Form validates inputs correctly
4. ✅ Razorpay modal opens on submit
5. ✅ Payment completes successfully
6. ✅ Success message displays
7. ✅ Donation appears in database with `called_by = 'DONATION'`
8. ✅ User redirects to homepage

---

**Need Help?** Check `DONATION_SYSTEM_IMPLEMENTATION.md` for detailed technical documentation.

