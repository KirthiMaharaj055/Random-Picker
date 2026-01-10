# Random Picker (Secret Santa)

Small React + TypeScript app to collect participant names and assign Secret Santa pairings locally.

Quick start

```bash
# from project root
npm install
npm run dev
# open http://localhost:5173
```

Features

- Add, remove participants
- Create random assignments that avoid self-assignments (derangement)
- Results are saved in localStorage
- Each participant can click "Reveal" to see only their assigned match

Privacy note

All pairings are generated locally in your browser and saved to localStorage. No data is sent to any server. Avoid exporting or sharing the pairs if you want to keep them secret.
