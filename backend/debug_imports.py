print("🔍 Debugging blockchain imports...")

try:
    import solana
    print(f"✅ solana imported successfully - version: {solana.__version__}")
except ImportError as e:
    print(f"❌ solana import failed: {e}")
except Exception as e:
    print(f"❌ solana import error: {e}")

try:
    from solana.keypair import Keypair
    print("✅ solana.keypair.Keypair imported successfully")
    
    # Test keypair creation
    kp = Keypair()
    print(f"✅ Created test keypair: {kp.public_key}")
    
except ImportError as e:
    print(f"❌ Keypair import failed: {e}")
except Exception as e:
    print(f"❌ Keypair creation error: {e}")

try:
    from solana.rpc.api import Client
    print("✅ solana.rpc.api.Client imported successfully")
    
    # Test client creation
    client = Client("https://api.devnet.solana.com")
    print("✅ Solana client created successfully")
    
except ImportError as e:
    print(f"❌ Client import failed: {e}")
except Exception as e:
    print(f"❌ Client creation error: {e}")

try:
    from solana.publickey import PublicKey
    print("✅ solana.publickey.PublicKey imported successfully")
    
    # Test PublicKey creation
    pk = PublicKey("11111111111111111111111111111112")
    print(f"✅ Created test PublicKey: {pk}")
    
except ImportError as e:
    print(f"❌ PublicKey import failed: {e}")
except Exception as e:
    print(f"❌ PublicKey creation error: {e}")

print("\n🧪 Testing SolanaService import...")
try:
    from services.solana_service import SolanaService
    print("✅ SolanaService imported successfully")
except ImportError as e:
    print(f"❌ SolanaService import failed: {e}")
except Exception as e:
    print(f"❌ SolanaService error: {e}")

print("\n🧪 Testing TokenService import...")
try:
    from services.token_service import TokenService
    print("✅ TokenService imported successfully")
except ImportError as e:
    print(f"❌ TokenService import failed: {e}")
except Exception as e:
    print(f"❌ TokenService error: {e}")