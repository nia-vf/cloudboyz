[ Changelog ]

- Added cli interface for instance type and operating system
- file generation of queried ec2 instance details (including pricing)

[ Usage ]
Prereqs:

- homebrew installed
- node & typescript installed (via brew)
- yarn installed (via brew)

`yarn start:dev`

- Will prompt for `instance type` and `operating system` outputting the details in stdout (JSON format) and a .json file named output-[instanceType]-[operatingSystem].json
