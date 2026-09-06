import { PrismaClient, RoleType, KycStatus, AddressType, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GoShashi database seed...');

  // 1. Seed Roles
  const roles: RoleType[] = [
    RoleType.CUSTOMER,
    RoleType.PARTNER,
    RoleType.ADMIN,
    RoleType.SUPER_ADMIN,
    RoleType.OPERATIONS,
    RoleType.FINANCE,
    RoleType.SUPPORT,
    RoleType.CONTENT_MANAGER,
  ];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName} role with domain privileges`,
      },
    });
  }

  // 2. Seed Default City
  const gurugram = await prisma.city.upsert({
    where: { slug: 'gurugram' },
    update: {},
    create: {
      name: 'Gurugram',
      slug: 'gurugram',
      state: 'Haryana',
      isActive: true,
    },
  });

  // 3. Seed Users & Accounts
  // Argon2 / bcrypt placeholder hash for "GoShashi@2026"
  const defaultPasswordHash = '$argon2id$v=19$m=65536,t=3,p=4$4H9L88h7w0K1y7B1oD$HkR32q66zYh0tA89E+3lP/k+1xQZ800dD+7UjD9qB5E';

  // Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@goshashi.com' },
    update: {},
    create: {
      email: 'admin@goshashi.com',
      mobile: '9876543210',
      passwordHash: defaultPasswordHash,
      name: 'GoShashi Admin',
      isEmailVerified: true,
      isMobileVerified: true,
    },
  });

  const superAdminRole = await prisma.role.findUnique({ where: { name: RoleType.SUPER_ADMIN } });
  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: superAdminRole.id },
    });
  }

  // Customer
  const customerUser = await prisma.user.upsert({
    where: { email: 'shashi.customer@goshashi.com' },
    update: {},
    create: {
      email: 'shashi.customer@goshashi.com',
      mobile: '9811122233',
      passwordHash: defaultPasswordHash,
      name: 'Shashi Kumar',
      isEmailVerified: true,
      isMobileVerified: true,
    },
  });

  const customerRole = await prisma.role.findUnique({ where: { name: RoleType.CUSTOMER } });
  if (customerRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: customerUser.id, roleId: customerRole.id } },
      update: {},
      create: { userId: customerUser.id, roleId: customerRole.id },
    });
  }

  const customerProfile = await prisma.customer.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      referralCode: 'SHASHI2026',
    },
  });

  // Customer Default Address
  await prisma.address.create({
    data: {
      customerId: customerProfile.id,
      name: 'Shashi Kumar',
      mobile: '9811122233',
      house: 'Tower 4, Flat 1202, DLF Phase 5',
      street: 'Golf Course Road',
      area: 'Sector 54',
      landmark: 'Near Rapid Metro Station',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      addressType: AddressType.HOME,
      isDefault: true,
    },
  });

  // Partner User
  const partnerUser = await prisma.user.upsert({
    where: { email: 'rajesh.partner@goshashi.com' },
    update: {},
    create: {
      email: 'rajesh.partner@goshashi.com',
      mobile: '9899988877',
      passwordHash: defaultPasswordHash,
      name: 'Rajesh Sharma',
      isEmailVerified: true,
      isMobileVerified: true,
    },
  });

  const partnerRole = await prisma.role.findUnique({ where: { name: RoleType.PARTNER } });
  if (partnerRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: partnerUser.id, roleId: partnerRole.id } },
      update: {},
      create: { userId: partnerUser.id, roleId: partnerRole.id },
    });
  }

  await prisma.partner.upsert({
    where: { userId: partnerUser.id },
    update: {},
    create: {
      userId: partnerUser.id,
      businessName: 'Sharma Home Solutions',
      businessType: 'INDIVIDUAL',
      experienceYears: 7,
      serviceRadiusKm: 15.0,
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      kycStatus: KycStatus.APPROVED,
      rating: 4.9,
      reviewCount: 48,
      completedJobsCount: 124,
      isAvailable: true,
    },
  });

  // 4. Seed 8 Categories and Realistic Services
  const catalogData = [
    {
      name: 'Home Cleaning',
      slug: 'home-cleaning',
      icon: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      description: 'Deep cleaning, sanitization, kitchen, bathroom, and full villa & apartment care.',
      services: [
        {
          name: 'Complete Deep Home Cleaning',
          slug: 'complete-deep-home-cleaning',
          shortDescription: 'Comprehensive top-to-bottom sanitization and deep scrubbing for your entire home.',
          description: 'Includes floor scrubbing with industrial single-disc machine, bathroom acid descaling, kitchen grease removal, balcony wash, and window glass streak-free cleaning.',
          basePrice: 3499,
          salePrice: 2799,
          durationMinutes: 240,
          warrantyDays: 7,
          featured: true,
          included: ['Floor scrubbing with single-disc machine', 'Kitchen oil and grease degreasing', 'Bathroom tiles descaling and sanitization', 'Balcony and window glass cleaning'],
          excluded: ['Wall painting touchups', 'Cleaning inside locked cupboards and drawers'],
          addons: [
            { name: 'Sofa Shampooing (3-Seater)', price: 699 },
            { name: 'Balcony Pressure Jet Cleaning', price: 399 },
            { name: 'Refrigerator Interior Sanitization', price: 299 },
          ],
        },
        {
          name: 'Intense Bathroom Descaling & Cleaning',
          slug: 'intense-bathroom-cleaning',
          shortDescription: 'Spotless bathroom tiles, grout restoration, and hard water stain removal.',
          description: 'Heavy-duty removal of hard water yellow marks, tap scale removal, toilet disinfection, and mirror polishing using eco-safe Diversey grade chemicals.',
          basePrice: 799,
          salePrice: 599,
          durationMinutes: 60,
          warrantyDays: 5,
          featured: false,
          included: ['Tile grout descaling', 'Mirror and glass fixture buffing', 'Exhaust fan degreasing', 'Disinfection of WC and washbasin'],
          excluded: ['Plumbing repairs or pipe blockages'],
          addons: [
            { name: 'Anti-Fungal Grout Sealant Treatment', price: 299 },
          ],
        },
        {
          name: 'Modular Kitchen Deep Degreasing',
          slug: 'modular-kitchen-deep-cleaning',
          shortDescription: 'Complete removal of stubborn oil grease, chimney exterior cleaning, and cabinet wipe-down.',
          description: 'Specialized degreasing for chimney surface, stove burners, tile backsplashes, and trolley exteriors.',
          basePrice: 1599,
          salePrice: 1299,
          durationMinutes: 120,
          warrantyDays: 7,
          featured: false,
          included: ['Chimney filter & body degreasing', 'Backsplash tile oil stain removal', 'Under-sink sanitization'],
          excluded: ['Chimney internal motor repair'],
          addons: [
            { name: 'Microwave & Oven Interior Steam Clean', price: 349 },
          ],
        },
      ],
    },
    {
      name: 'Appliance Repair',
      slug: 'appliance-repair',
      icon: 'Tv',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      description: 'Expert diagnostic and repair for AC, refrigerator, washing machine, microwave, and water purifier.',
      services: [
        {
          name: 'Split AC Power Jet Deep Service',
          slug: 'split-ac-power-jet-service',
          shortDescription: 'High-pressure foam wash for indoor and outdoor AC units with 2X cooling boost.',
          description: 'Includes water-jacket foam wash, cooling coil decontamination, outdoor compressor cleaning, and gas pressure diagnostic check.',
          basePrice: 699,
          salePrice: 499,
          durationMinutes: 60,
          warrantyDays: 30,
          featured: true,
          included: ['Indoor unit pressure jet foam wash', 'Outdoor condenser water wash', 'Gas leakage check', 'Drain pipe flushing'],
          excluded: ['Spare part replacements or gas top-up cost'],
          addons: [
            { name: 'AC Anti-Bacterial Sanitization Shield', price: 199 },
            { name: 'AC Gas Top-Up (R32 / R410A)', price: 1899 },
          ],
        },
        {
          name: 'Front / Top Load Washing Machine Repair & Diagnostic',
          slug: 'washing-machine-repair',
          shortDescription: 'Fix drum spin issues, drain errors, loud noise, and electronic PCB faults.',
          description: 'Comprehensive diagnostic by certified appliance technician covering motor, belt, water inlet valve, and drum suspension.',
          basePrice: 499,
          salePrice: 349,
          durationMinutes: 60,
          warrantyDays: 30,
          featured: false,
          included: ['Full 360-degree diagnostic check', 'Filter cleaning and descaling advice'],
          excluded: ['Cost of replacement spare parts'],
          addons: [
            { name: 'Tub Descaling Treatment Pack', price: 299 },
          ],
        },
        {
          name: 'Double Door Refrigerator Cooling Repair',
          slug: 'refrigerator-cooling-repair',
          shortDescription: 'Restore ice making, defrosting cycle, and thermostat regulation.',
          description: 'Prompt service for frost build-up, gas leakage, compressor relays, and door gasket sealing.',
          basePrice: 499,
          salePrice: 399,
          durationMinutes: 60,
          warrantyDays: 30,
          featured: false,
          included: ['Compressor and thermostat health check', 'Condenser coil dust clearing'],
          excluded: ['Cost of compressor replacement or gas charging'],
          addons: [
            { name: 'Door Gasket Magnetic Replacement', price: 699 },
          ],
        },
      ],
    },
    {
      name: 'Plumbing',
      slug: 'plumbing',
      icon: 'Wrench',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
      description: 'Leak repair, tap installation, toilet flush overhaul, water tank cleaning, and pipe fixing.',
      services: [
        {
          name: 'Water Leakage & Pipe Joint Repair',
          slug: 'water-leakage-pipe-repair',
          shortDescription: 'Fast solution for concealed pipeline drips, valve seepage, and joint leaks.',
          description: 'Accurate acoustic or visual leak detection followed by CPVC/UPVC pipe cutting, socket replacement, and pressure testing.',
          basePrice: 399,
          salePrice: 299,
          durationMinutes: 45,
          warrantyDays: 30,
          featured: true,
          included: ['Pipe joint repair up to 2 joints', 'Thread sealing with Teflon tape', 'Post-repair water pressure test'],
          excluded: ['Wall plastering or repainting after breaking tile'],
          addons: [
            { name: 'Concealed Valve Replacement', price: 249 },
          ],
        },
        {
          name: 'Bathroom Tap & Mixer Installation / Replacement',
          slug: 'tap-mixer-replacement',
          shortDescription: 'Install wall mixers, pillar cocks, hand showers, and angle valves.',
          description: 'Precision mounting and alignment without scratching chrome finishes.',
          basePrice: 299,
          salePrice: 199,
          durationMinutes: 30,
          warrantyDays: 30,
          featured: false,
          included: ['Uninstallation of old fixture', 'Installation of new tap/mixer', 'Teflon waterproofing'],
          excluded: ['Cost of tap or mixer unit'],
          addons: [
            { name: 'Health Faucet Installation', price: 149 },
          ],
        },
        {
          name: 'Overhead Water Tank Chemical Cleaning (Up to 1000L)',
          slug: 'water-tank-cleaning',
          shortDescription: 'High-pressure mud slurry suction and UV antibacterial decontamination.',
          description: '6-stage cleaning process: de-watering, sludge removal, high pressure rotary cleaning, vacuuming, antibacterial spray, and UV disinfection.',
          basePrice: 1199,
          salePrice: 899,
          durationMinutes: 90,
          warrantyDays: 60,
          featured: false,
          included: ['6-stage tank sanitation', 'Sediment and algae evacuation'],
          excluded: ['Tank structural crack sealing'],
          addons: [
            { name: 'Additional 500L Capacity Add-on', price: 299 },
          ],
        },
      ],
    },
    {
      name: 'Electrical',
      slug: 'electrical',
      icon: 'Zap',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      description: 'Certified electricians for fan fitting, short circuit diagnostics, chandeliers, and switchboards.',
      services: [
        {
          name: 'Ceiling Fan Installation & Repair',
          slug: 'ceiling-fan-installation-repair',
          shortDescription: 'Regulator troubleshooting, downrod assembly, capacitor change, and silent running balance.',
          description: 'Safe installation on concrete ceilings with heavy-duty anchors and hook alignment.',
          basePrice: 249,
          salePrice: 189,
          durationMinutes: 30,
          warrantyDays: 30,
          featured: false,
          included: ['Fan assembly and blade balancing', 'Safety wire connection'],
          excluded: ['Civil plastering if new anchor hole required'],
          addons: [
            { name: 'Capacitor Replacement', price: 99 },
          ],
        },
        {
          name: 'Electrical Short Circuit & MCB Trip Diagnostic',
          slug: 'short-circuit-mcb-repair',
          shortDescription: 'Emergency isolation of electrical leakage, tripping breakers, and neutral wire faults.',
          description: 'Diagnostic using digital multimeters to trace line insulation breakdown and replace faulty MCBs or isolators.',
          basePrice: 499,
          salePrice: 399,
          durationMinutes: 60,
          warrantyDays: 30,
          featured: true,
          included: ['Multi-circuit continuity test', 'MCB connection tightening', 'Fault point isolation'],
          excluded: ['Cost of new MCB or heavy gauge wiring'],
          addons: [
            { name: 'Single Pole MCB Replacement', price: 149 },
          ],
        },
        {
          name: 'Switchboard & Socket Installation (Modular)',
          slug: 'switchboard-socket-installation',
          shortDescription: 'Install 6A/16A switches, AC power points, and USB wall chargers.',
          description: 'Neat wiring layout and grounding verification for heavy appliances.',
          basePrice: 199,
          salePrice: 149,
          durationMinutes: 30,
          warrantyDays: 30,
          featured: false,
          included: ['Switchboard plate fixing and wire termination'],
          excluded: ['Concealed wall conduit cutting'],
          addons: [
            { name: 'Heavy 16A/25A AC Socket Point Setup', price: 249 },
          ],
        },
      ],
    },
    {
      name: 'Carpentry',
      slug: 'carpentry',
      icon: 'Hammer',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      description: 'Furniture assembly, hinge alignment, lock repairs, modular wardrobe fixing, and woodwork.',
      services: [
        {
          name: 'Door Lock & Handle Replacement',
          slug: 'door-lock-handle-replacement',
          shortDescription: 'Mortise lock installation, cylinder replacement, and smart electronic lock fitting.',
          description: 'Chiseling, precise mortise pocket alignment, and secure latching for main and bedroom doors.',
          basePrice: 399,
          salePrice: 299,
          durationMinutes: 45,
          warrantyDays: 30,
          featured: false,
          included: ['Removal of worn lock', 'Accurate hole alignment and lock installation'],
          excluded: ['Cost of lock hardware'],
          addons: [
            { name: 'Door Stopper Installation', price: 79 },
          ],
        },
        {
          name: 'IKEA / Online Furniture Assembly (Bed / Wardrobe)',
          slug: 'furniture-assembly',
          shortDescription: 'Professional assembly of flat-pack beds, tables, bookcases, and wardrobes.',
          description: 'Assembled by experienced carpenters using power torque screwdrivers without damaging engineered wood veneer.',
          basePrice: 799,
          salePrice: 599,
          durationMinutes: 90,
          warrantyDays: 30,
          featured: true,
          included: ['Full flatpack unpacking and hardware assembly', 'Leveling on floor'],
          excluded: ['Wall anchoring if hardware not supplied in box'],
          addons: [
            { name: 'Wall Mounting Bracket Alignment', price: 199 },
          ],
        },
      ],
    },
    {
      name: 'Painting',
      slug: 'painting',
      icon: 'Paintbrush',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      description: 'Wall touch-ups, single room repaint, waterproofing primer, texture accents, and full apartment paint.',
      services: [
        {
          name: 'Single Room Wall Repaint (2 Coats Luxury Emulsion)',
          slug: 'single-room-wall-repaint',
          shortDescription: 'Flawless roller finish, putty touch-ups, masking protection, and Asian Paints Royale.',
          description: 'Includes floor sheet masking, crack filling, primer coat, and two coats of washable acrylic emulsion.',
          basePrice: 3499,
          salePrice: 2899,
          durationMinutes: 300,
          warrantyDays: 365,
          featured: true,
          included: ['Floor and furniture plastic masking', 'Minor plaster crack putty repair', '2 coats of premium emulsion'],
          excluded: ['Seepage dampness treatment on exterior walls'],
          addons: [
            { name: 'Accent Wall Geometric Texture Stencil', price: 999 },
            { name: 'Ceiling Paint Coat (Tractor Emulsion)', price: 799 },
          ],
        },
        {
          name: 'Waterproofing Damp Seepage Shield (Per Wall)',
          slug: 'waterproofing-damp-seepage-repair',
          shortDescription: 'Repair peeling paint, efflorescence chalking, and damp wall patches.',
          description: 'Scraping dead plaster to masonry, applying crystalline waterproofing slurry, and waterproof putty.',
          basePrice: 1899,
          salePrice: 1499,
          durationMinutes: 180,
          warrantyDays: 180,
          featured: false,
          included: ['Masonry scraping', '2-coat elastomeric waterproofing polymer coat'],
          excluded: ['External building duct leak repairs'],
          addons: [
            { name: 'Anti-Fungal Primer Undercoat', price: 349 },
          ],
        },
      ],
    },
    {
      name: 'Pest Control',
      slug: 'pest-control',
      icon: 'ShieldAlert',
      image: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=80',
      description: 'Odorless cockroach gel baiting, anti-termite drill & fill treatment, bed bugs, and rodent proofing.',
      services: [
        {
          name: 'Herbal Cockroach & Ant Control (Odorless Gel)',
          slug: 'herbal-cockroach-ant-control',
          shortDescription: 'Non-toxic, food-safe gel dots in cabinet hinges, drawers, and under-sink nooks.',
          description: 'Bayer certified odorless fipronil gel baiting. No need to empty kitchen cabinets or vacate home.',
          basePrice: 899,
          salePrice: 699,
          durationMinutes: 45,
          warrantyDays: 90,
          featured: true,
          included: ['Full kitchen gel dotting', 'Drain and bathroom spray barrier', '90-day warranty re-visit if pests persist'],
          excluded: ['Termite or bed bug eradication'],
          addons: [
            { name: 'Fly & Mosquito Herbal Fogging Spray', price: 299 },
          ],
        },
        {
          name: 'Intensive Bed Bug Eradication (2-Service Combo)',
          slug: 'bed-bug-eradication-treatment',
          shortDescription: 'Eliminate bed bugs and eggs from mattresses, seams, headboards, and cracks.',
          description: 'Includes dual treatment scheduled 15 days apart to break the bed bug breeding cycle.',
          basePrice: 1799,
          salePrice: 1499,
          durationMinutes: 90,
          warrantyDays: 60,
          featured: false,
          included: ['Mattress steam and contact spray', 'Follow-up second treatment in 14 days'],
          excluded: ['Washing of heavy blankets or curtains'],
          addons: [
            { name: 'Mattress Zip Encasement Guard', price: 499 },
          ],
        },
      ],
    },
    {
      name: 'Photography',
      slug: 'photography',
      icon: 'Camera',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      description: 'Maternity, birthday, corporate headshots, real estate interior architecture, and celebration shoots.',
      services: [
        {
          name: 'Event & Birthday Celebration Photography (2 Hours)',
          slug: 'event-birthday-photography',
          shortDescription: 'Candid and portrait coverage with full-frame mirrorless camera and high-res edits.',
          description: 'Professional photographer equipped with Sony Alpha/Canon R series, prime lenses, and speedlights.',
          basePrice: 4499,
          salePrice: 3499,
          durationMinutes: 120,
          warrantyDays: 14,
          featured: true,
          included: ['2 hours on-location coverage', 'All raw images in cloud drive within 24 hours', '30 professionally retouched high-res photos'],
          excluded: ['Physical photo book printing'],
          addons: [
            { name: 'Additional Hour of Coverage', price: 1299 },
            { name: 'Short Highlight Reel (60s Instagram Reel)', price: 1499 },
          ],
        },
        {
          name: 'Real Estate & Airbnb Architecture Photography',
          slug: 'real-estate-interior-photography',
          shortDescription: 'HDR wide-angle interior and ambient shots to maximize property rental listings.',
          description: 'Ultra wide tilt-shift perspective correction, twilight balancing, and crisp window pull techniques.',
          basePrice: 3999,
          salePrice: 2999,
          durationMinutes: 90,
          warrantyDays: 14,
          featured: false,
          included: ['Up to 3BHK full interior & exterior coverage', '25 high-dynamic range edited deliverables'],
          excluded: ['Drone aerial survey (available as add-on)'],
          addons: [
            { name: '4K Drone Aerial Exterior Fly-Through', price: 2499 },
          ],
        },
      ],
    },
  ];

  for (const catData of catalogData) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        icon: catData.icon,
        image: catData.image,
        description: catData.description,
      },
      create: {
        name: catData.name,
        slug: catData.slug,
        icon: catData.icon,
        image: catData.image,
        description: catData.description,
        status: true,
        sortOrder: 1,
      },
    });

    for (const serv of catData.services) {
      const service = await prisma.service.upsert({
        where: { slug: serv.slug },
        update: {
          name: serv.name,
          basePrice: serv.basePrice,
          salePrice: serv.salePrice,
          durationMinutes: serv.durationMinutes,
          warrantyDays: serv.warrantyDays,
          featured: serv.featured,
          shortDescription: serv.shortDescription,
          description: serv.description,
        },
        create: {
          categoryId: category.id,
          name: serv.name,
          slug: serv.slug,
          shortDescription: serv.shortDescription,
          description: serv.description,
          basePrice: serv.basePrice,
          salePrice: serv.salePrice,
          durationMinutes: serv.durationMinutes,
          warrantyDays: serv.warrantyDays,
          featured: serv.featured,
          rating: 4.85,
          reviewCount: 28,
        },
      });

      // Images
      await prisma.serviceImage.deleteMany({ where: { serviceId: service.id } });
      await prisma.serviceImage.create({
        data: {
          serviceId: service.id,
          url: catData.image,
          isPrimary: true,
          sortOrder: 0,
        },
      });

      // Inclusions
      await prisma.serviceIncludedItem.deleteMany({ where: { serviceId: service.id } });
      for (const inc of serv.included) {
        await prisma.serviceIncludedItem.create({
          data: { serviceId: service.id, item: inc },
        });
      }

      // Exclusions
      await prisma.serviceExcludedItem.deleteMany({ where: { serviceId: service.id } });
      for (const exc of serv.excluded) {
        await prisma.serviceExcludedItem.create({
          data: { serviceId: service.id, item: exc },
        });
      }

      // Addons
      await prisma.serviceAddon.deleteMany({ where: { serviceId: service.id } });
      for (const addon of serv.addons) {
        await prisma.serviceAddon.create({
          data: {
            serviceId: service.id,
            name: addon.name,
            price: addon.price,
          },
        });
      }

      // FAQs
      await prisma.serviceFAQ.deleteMany({ where: { serviceId: service.id } });
      await prisma.serviceFAQ.createMany({
        data: [
          {
            serviceId: service.id,
            question: 'Are your service professionals verified and background-checked?',
            answer: 'Yes, every GoShashi partner undergoes strict government ID (Aadhaar & PAN) verification and skill onboarding before visiting any customer residence.',
            sortOrder: 0,
          },
          {
            serviceId: service.id,
            question: 'What if I am not satisfied with the work done?',
            answer: 'GoShashi offers a complete satisfaction guarantee and warranty window on all covered services. We will dispatch a senior partner for a free rework or provide an appropriate resolution.',
            sortOrder: 1,
          },
        ],
      });
    }
  }

  // 5. Seed Promotional Banners
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      {
        title: 'Supercharge Your Home Care',
        subtitle: 'Verified professionals in Gurugram at your doorstep in 60 mins',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
        buttonText: 'Book Service',
        buttonUrl: '/services',
        discount: 'Flat ₹150 OFF with code SHASHI150',
        sortOrder: 1,
      },
      {
        title: 'Breathe Pure with AC Jet Wash',
        subtitle: 'Double the cooling and halve power consumption',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        buttonText: 'Book AC Service',
        buttonUrl: '/services/appliance-repair/split-ac-power-jet-service',
        discount: 'Starting at ₹499',
        sortOrder: 2,
      },
    ],
  });

  // 6. Seed Coupons
  await prisma.coupon.upsert({
    where: { code: 'SHASHI150' },
    update: {},
    create: {
      code: 'SHASHI150',
      type: 'FIXED',
      value: 150,
      minimumOrder: 499,
      maximumDiscount: 150,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      status: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      type: 'PERCENTAGE',
      value: 20,
      minimumOrder: 799,
      maximumDiscount: 300,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      status: true,
    },
  });

  // 7. Seed CMS Pages
  const cmsPages = [
    {
      slug: 'about',
      title: 'About GoShashi',
      content: '# About GoShashi\n\nGoShashi is India’s premier on-demand services platform founded to bring transparency, predictability, and dignity of labor to household maintenance.',
    },
    {
      slug: 'how-it-works',
      title: 'How It Works',
      content: '# How GoShashi Works\n\n1. Select your service\n2. Choose date and preferred time slot\n3. Enjoy professional on-time service with warranty.',
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      content: '# Privacy Policy\n\nYour privacy is paramount. GoShashi never sells personal data and stores sensitive information with bank-grade encryption.',
    },
    {
      slug: 'terms',
      title: 'Terms & Conditions',
      content: '# Terms and Conditions\n\nBy accessing GoShashi, you agree to our standard terms of service, cancellation policies, and warranty guidelines.',
    },
  ];

  for (const page of cmsPages) {
    await prisma.cMSPage.upsert({
      where: { slug: page.slug },
      update: { content: page.content, title: page.title },
      create: { slug: page.slug, title: page.title, content: page.content, status: true },
    });
  }

  console.log('✅ GoShashi database successfully seeded with realistic categories, services, users & configuration!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
